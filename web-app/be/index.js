import express from 'express';
import crypto from 'crypto';
import multer from 'multer';
import admin from 'firebase-admin';
import { db } from './config.js';
import { supabase } from './supabaseClient.js';

const app = express();
const port = 5000;

const upload = multer({ storage: multer.memoryStorage() });

// Middleware untuk CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // Izinkan lebih banyak metode
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
  next();
});

// Middleware untuk membaca JSON body (diperlukan untuk /verify)
app.use(express.json());

// =================================================================
// MIDDLEWARE UNTUK VERIFIKASI TOKEN AUTENTIKASI
// =================================================================
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (token == null) {
    return res.status(401).send({ error: 'Token tidak ditemukan. Anda harus login.' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // Simpan data user (uid, email, dll) di object request
    next();
  } catch (error) {
    console.error("Error verifikasi token:", error);
    return res.status(403).send({ error: 'Token tidak valid atau sudah kedaluwarsa.' });
  }
};

// =================================================================
// ENDPOINT UNTUK AUTENTIKASI PENGGUNA
// =================================================================
// Endpoint untuk registrasi user baru
app.post('/register', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send({ error: 'Email dan password dibutuhkan.' });
    }
    try {
        const userRecord = await admin.auth().createUser({
            email: email,
            password: password,
        });
        res.status(201).send({ uid: userRecord.uid, email: userRecord.email });
    } catch (error) {
        console.error("Gagal membuat user:", error);
        res.status(500).send({ error: 'Gagal mendaftarkan pengguna.', details: error.message });
    }
});
// Catatan: Proses login biasanya dilakukan di sisi client menggunakan Firebase SDK Client.
// Client akan mendapatkan ID Token setelah login, lalu mengirim token itu ke server ini.

// =================================================================
// ENDPOINT UNTUK MEMBUAT KUNCI (Dilindungi Autentikasi)
// =================================================================
app.get('/KeyGen', authenticateToken, (req, res) => { // REVISI: Tambahkan middleware authenticateToken
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'der' },
      privateKeyEncoding: { type: 'pkcs8', format: 'der' },
    });
  
    // REVISI: Tambahkan userId ke data yang disimpan
    const keyPairData = {
      userId: req.user.uid, // Kaitkan kunci dengan user yang sedang login
      publicKey: publicKey.toString('base64'),
      privateKey: privateKey.toString('base64'),
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    db.collection('keyPairs')
      .add(keyPairData)
      .then((docRef) => {
        // REVISI: Jangan kirim privateKey kembali ke client. Cukup kirim ID dan public key.
        res.send({ id: docRef.id, publicKey: keyPairData.publicKey });
      })
      .catch((error) => {
        console.error("Gagal menyimpan key pair:", error);
        res.status(500).send({ error: 'Failed to store key pair' });
      });
});

// =================================================================
// ENDPOINT UNTUK MENANDATANGANI (Dilindungi & Lebih Aman)
// =================================================================
app.post("/sign", authenticateToken, upload.single("file"), async (req, res) => { // REVISI: Tambahkan middleware
  // REVISI: Input diubah, tidak lagi menerima privateKey, tapi keyPairId
  const { keyPairId } = req.body;
  const uploadedFile = req.file;
  const userId = req.user.uid;

  if (!uploadedFile) {
    return res.status(400).send({ error: "File tidak ditemukan." });
  }
  if (!keyPairId) {
    return res.status(400).send({ error: "ID Key Pair dibutuhkan." });
  }

  try {
    // 1. Ambil key pair dari Firestore
    const keyDoc = await db.collection('keyPairs').doc(keyPairId).get();
    if (!keyDoc.exists) {
        return res.status(404).send({ error: 'Key Pair tidak ditemukan.' });
    }

    const keyData = keyDoc.data();

    // 2. Verifikasi kepemilikan kunci
    if (keyData.userId !== userId) {
        return res.status(403).send({ error: 'Akses ditolak. Anda bukan pemilik key pair ini.' });
    }

    // 3. Gunakan private key dari Firestore untuk membuat signature
    const privateKey = crypto.createPrivateKey({
      key: Buffer.from(keyData.privateKey, "base64"),
      type: "pkcs8",
      format: "der",
    });

    const sign = crypto.createSign("SHA256");
    sign.update(uploadedFile.buffer);
    sign.end();
    const signature = sign.sign(privateKey).toString("base64");

    const uniqueFileName = `${Date.now()}-${uploadedFile.originalname}`;

    // 4. Unggah file ke Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('filles')
      .upload(uniqueFileName, uploadedFile.buffer, {
        contentType: uploadedFile.mimetype,
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      throw new Error("Gagal mengunggah file ke Supabase Storage: " + uploadError.message);
    }

    // 5. Simpan metadata ke Firestore dengan informasi penandatangan
    const docRef = await db.collection("documents").add({
      fileName: uniqueFileName,
      originalName: uploadedFile.originalname,
      signature: signature,
      // REVISI: Tambahkan keterangan siapa yang menandatangani
      signedBy: {
        uid: req.user.uid,
        email: req.user.email, // Ambil email dari token yang sudah didekode
      },
      signedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log("File berhasil ditandatangani oleh", req.user.email);
    res.send({ id: docRef.id, fileName: uniqueFileName, signature });

  } catch (error) {
    console.error("Terjadi error saat membuat signature:", error);
    res.status(500).send({ error: "Terjadi kesalahan pada server saat proses signing.", details: error.message });
  }
});

// =================================================================
// ENDPOINT UNTUK VERIFIKASI (Tidak Diubah, tetap publik)
// =================================================================
app.post("/verify", async (req, res) => {
  const { documentId, publicKey: publicKeyString } = req.body;

  if (!documentId || !publicKeyString) {
    return res.status(400).send({ verify: false, error: "Document ID and Public Key are required." });
  }
  
  try {
    const doc = await db.collection('documents').doc(documentId).get();
    if (!doc.exists) {
      return res.status(404).send({ verify: false, error: "Document not found" });
    }

    const { fileName, signature: storedSignature, signedBy } = doc.data();
    
    const { data: fileBlob, error: downloadError } = await supabase.storage
      .from('filles')
      .download(fileName);
    if (downloadError) {
      throw new Error("Could not download file from storage for verification.");
    }

    const fileBuffer = Buffer.from(await fileBlob.arrayBuffer());

    const publicKey = crypto.createPublicKey({
      key: Buffer.from(publicKeyString, "base64"),
      type: "spki",
      format: "der",
    });

    const verify = crypto.createVerify("SHA256");
    verify.update(fileBuffer);
    verify.end();

    const result = verify.verify(publicKey, Buffer.from(storedSignature, "base64"));
    
    // REVISI: Sertakan informasi penandatangan di response
    const responsePayload = {
        fileName,
        signature: storedSignature,
        verify: result,
        signedBy: signedBy || null // Sertakan info signedBy jika ada
    };

    if (result) {
      const { data: urlData } = supabase.storage.from('filles').getPublicUrl(fileName);
      responsePayload.fileURL = urlData.publicUrl;
      res.send(responsePayload);
    } else {
      responsePayload.error = "Signature is not valid.";
      res.send(responsePayload);
    }
  } catch (error) {
    console.error("Error during verification:", error);
    res.status(500).send({ error: "An error occurred during verification. Check if the Public Key is correct." });
  }
});

// =================================================================
// ENDPOINT UNTUK MENGAMBIL DOKUMEN (Tidak Diubah)
// =================================================================
app.get('/documents/:id', (req, res) => {
  const documentId = req.params.id;
  
    db.collection('documents')
      .doc(documentId)
      .get()
      .then((doc) => {
        if (!doc.exists) {
          res.status(404).send({ error: 'Document not found' });
        } else {
          res.send(doc.data());
        }
      })
      .catch((error) => {
        res.status(500).send({ error: 'Failed to fetch document' });
      });
}); 

// =================================================================
// SERVER LISTENER
// =================================================================
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});