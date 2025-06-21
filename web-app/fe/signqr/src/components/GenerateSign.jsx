import React, { useState, useEffect } from "react";
import axios from "axios";
import QRCode from "qrcode";
import { FiUploadCloud, FiKey, FiPenTool, FiCopy, FiCheckCircle, FiLoader, FiDownload, FiSmartphone } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext"; // <-- GUNAKAN AUTH CONTEXT

export default function GenerateSignaturePage() {
  const [inputFile, setInputFile] = useState(null);
  // HAPUS: const [privateKey, setPrivateKey] = useState("");
  const [keyPairs, setKeyPairs] = useState([]); // <-- State untuk daftar key pair
  const [selectedKeyId, setSelectedKeyId] = useState(""); // <-- State untuk key yang dipilih
  const [signatureData, setSignatureData] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const { idToken } = useAuth(); // <-- Ambil ID Token

  // Ambil key pairs milik user saat komponen dimuat
  useEffect(() => {
    const fetchKeys = async () => {
      if (!idToken) return;
      try {
        const res = await axios.get("http://localhost:5000/my-keys", {
          headers: { 'Authorization': `Bearer ${idToken}` }
        });
        setKeyPairs(res.data);
        if (res.data.length > 0) {
          setSelectedKeyId(res.data[0].id); // Pilih key pertama sebagai default
        }
      } catch (err) {
        toast.error("Gagal mengambil daftar kunci.");
      }
    };
    fetchKeys();
  }, [idToken]);

  useEffect(() => {
    async function generateQrFromUrl(url) {
      if (!url) return;
      try {
        const qrCodeDataUrl = await QRCode.toDataURL(url, { width: 256, margin: 2 });
        setImageUrl(qrCodeDataUrl);
      } catch (err) { console.error("Gagal membuat QR Code:", err); }
    }
    if (signatureData && signatureData.id) {
      const verificationUrl = `${window.location.origin}/verify/${signatureData.id}`;
      generateQrFromUrl(verificationUrl);
    }
  }, [signatureData]);

  async function handleGenerate() {
    // MODIFIKASI: Cek file dan selectedKeyId
    if (!inputFile || !selectedKeyId) {
      toast.error("Pilih file dan key pair untuk menandatangani.");
      return;
    }
    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", inputFile);
    formData.append("keyPairId", selectedKeyId); // <-- KIRIM KEY PAIR ID, BUKAN PRIVATE KEY

    try {
      const res = await axios.post("http://localhost:5000/sign", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          'Authorization': `Bearer ${idToken}` // <-- TAMBAHKAN HEADER AUTENTIKASI
        },
      });
      setSignatureData({ text: res.data.signature, id: res.data.id });
      toast.success("Signature dan QR Code berhasil dibuat!");
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Terjadi kesalahan.";
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }

  // Fungsi lainnya (handleCopy, handleFileChange) tidak perlu diubah
  function handleCopy() {
    if (!signatureData?.text) return;
    navigator.clipboard.writeText(signatureData.text).then(() => {
      setCopied(true);
      toast.success("Signature disalin!");
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      setInputFile(file);
      setSignatureData(null);
      setImageUrl("");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <h1 className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
          Generate Digital Signature
        </h1>
        <p className="mt-2 text-text-muted">Sign your document to prove its authenticity.</p>
      </div>

      <div className="w-full max-w-5xl rounded-2xl border border-border-color bg-card-bg p-8 shadow-2xl backdrop-blur-lg">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="mb-3 flex items-center gap-2 text-xl font-semibold text-secondary"><FiUploadCloud /> <span>Step 1: Upload Your File</span></h2>
              {/* ... Bagian upload file tidak berubah ... */}
               <label htmlFor="file-upload" className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border-color bg-dark-bg p-6 text-center transition hover:border-secondary">
                <FiUploadCloud className="mb-2 h-10 w-10 text-text-muted" />
                <span className="font-semibold text-text-light">Click to upload a file</span>
                <p className="text-xs text-text-muted">Any file type is supported</p>
              </label>
              <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} />
              {inputFile && <div className="mt-3 w-full rounded-md bg-green-500/10 p-2 text-center text-sm text-green-400">File selected: <strong>{inputFile.name}</strong></div>}
            </div>
            
            {/* ====== PERUBAHAN BESAR DI SINI ====== */}
            <div>
              <h2 className="mb-3 flex items-center gap-2 text-xl font-semibold text-primary"><FiKey /> <span>Step 2: Choose Your Key</span></h2>
              {keyPairs.length > 0 ? (
                <select 
                  value={selectedKeyId} 
                  onChange={(e) => setSelectedKeyId(e.target.value)}
                  className="w-full rounded-lg border border-border-color bg-dark-bg p-3 text-sm text-text-light focus:border-primary focus:ring-2 focus:ring-primary"
                >
                  {keyPairs.map(key => (
                    <option key={key.id} value={key.id}>
                      ID: {key.id.substring(0, 10)}... (Created at: {
                        key.createdAt ? new Date(key.createdAt).toLocaleDateString() : 'Unknown'
                      })
                    </option>
                  ))}
                </select>
              ) : (
                <div className="text-center text-text-muted p-4 bg-dark-bg rounded-lg">
                  <p>Anda belum memiliki kunci. Silakan buat di halaman 'Generate Key'.</p>
                </div>
              )}
            </div>
            {/* ====== AKHIR PERUBAHAN BESAR ====== */}
          </div>

          <div className="flex flex-col">
            {/* ... Bagian output tidak berubah ... */}
             <h2 className="mb-3 flex items-center gap-2 text-xl font-semibold text-text-light"><FiPenTool /> <span>Step 3: Your Generated Output</span></h2>
            <div className="flex h-full flex-col items-center justify-center rounded-lg border border-border-color bg-dark-bg p-6">
              {!signatureData ? (
                <div className="text-center text-text-muted"><FiPenTool className="mx-auto mb-4 h-12 w-12" /><p>Your Signature and QR Code will appear here.</p></div>
              ) : (
                <div className="flex w-full flex-col items-center gap-4">
                  <textarea rows="4" className="w-full rounded-lg bg-black/30 p-3 text-sm text-text-light" value={signatureData.text} readOnly />
                  <button onClick={handleCopy} className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110">
                    {copied ? <FiCheckCircle /> : <FiCopy />} {copied ? 'Copied!' : 'Copy Signature'}
                  </button>
                  {imageUrl && (
                    <div className="mt-4 w-full rounded-lg bg-white p-4 text-center">
                      <p className="mb-2 flex items-center justify-center gap-2 text-sm font-bold text-dark-bg"><FiSmartphone/> Scan to Verify</p>
                      <img src={imageUrl} alt="Verification QR Code" className="mx-auto"/>
                      <a href={imageUrl} download="verification-qrcode.png" className="mt-2 inline-flex items-center gap-2 text-sm text-primary hover:underline"><FiDownload /> Download QR Code</a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-10 flex justify-center">
           <button onClick={handleGenerate} disabled={isLoading || !inputFile || !selectedKeyId} className="group flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-primary to-accent px-8 py-3 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 disabled:cursor-not-allowed disabled:bg-gradient-to-r disabled:from-text-muted disabled:to-text-muted disabled:hover:scale-100">
            {isLoading ? <FiLoader className="animate-spin" /> : <FiPenTool />}
            {isLoading ? 'Generating...' : 'Generate Signature'}
          </button>
        </div>
      </div>
    </div>
  );
}