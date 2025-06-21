# 📖 Digital Signature API Documentation

## 🚀 Overview

Digital Signature API adalah RESTful API yang menyediakan layanan untuk:
- 🔐 User authentication dan registrasi
- 🔑 Generasi RSA key pairs
- ✍️ Digital signing dokumen
- ✅ Verifikasi digital signature
- 📁 Manajemen dokumen dan kunci

**Base URL:** `http://localhost:5000`

**Version:** 1.0.0

---

## 🔐 Authentication

API menggunakan **JWT (JSON Web Token)** untuk autentikasi yang didapat dari Firebase Authentication.

### Header Format
```http
Authorization: Bearer <your_jwt_token>
```

### Mendapatkan Token
Token didapat melalui Firebase Authentication di sisi client, kemudian dikirim ke server untuk verifikasi.

---

## 📋 API Endpoints

### 🔵 Authentication Endpoints

#### `POST /register`
Registrasi user baru

**Request:**
```http
POST /register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response - Success (201):**
```json
{
  "uid": "firebase_user_id",
  "email": "user@example.com"
}
```

**Response - Error (400):**
```json
{
  "error": "Email dan password dibutuhkan."
}
```

**Response - Error (500):**
```json
{
  "error": "Gagal mendaftarkan pengguna.",
  "details": "Error message details"
}
```

---

### 🔑 Key Management Endpoints

#### `GET /my-keys` 🔒
Mengambil semua key pairs milik user yang sedang login

**Headers:**
```http
Authorization: Bearer <jwt_token>
```

**Response - Success (200):**
```json
[
  {
    "id": "keypair_document_id",
    "userId": "user_firebase_uid",
    "publicKey": "base64_encoded_public_key",
    "privateKey": "base64_encoded_private_key",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

**Response - Error (401):**
```json
{
  "error": "Token tidak ditemukan. Anda harus login."
}
```

**Response - Error (403):**
```json
{
  "error": "Token tidak valid atau sudah kedaluwarsa."
}
```

#### `GET /KeyGen` 🔒
Generate RSA key pair baru untuk user

**Headers:**
```http
Authorization: Bearer <jwt_token>
```

**Response - Success (200):**
```json
{
  "id": "keypair_document_id",
  "publicKey": "base64_encoded_public_key"
}
```

**Response - Error (500):**
```json
{
  "error": "Failed to store key pair"
}
```

---

### ✍️ Signing Endpoints

#### `POST /sign` 🔒
Menandatangani dokumen menggunakan key pair milik user

**Headers:**
```http
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```

**Request:**
```http
POST /sign
Content-Type: multipart/form-data

file: <binary_file_data>
keyPairId: "keypair_document_id"
```

**Response - Success (200):**
```json
{
  "id": "signed_document_id",
  "fileName": "1640123456789-document.pdf",
  "signature": "base64_encoded_signature"
}
```

**Response - Error (400):**
```json
{
  "error": "File tidak ditemukan."
}
```

**Response - Error (404):**
```json
{
  "error": "Key Pair tidak ditemukan."
}
```

**Response - Error (403):**
```json
{
  "error": "Akses ditolak. Anda bukan pemilik key pair ini."
}
```

---

### ✅ Verification Endpoints

#### `POST /verify` 🌐
Verifikasi digital signature dokumen (endpoint publik)

**Request:**
```http
POST /verify
Content-Type: application/json

{
  "documentId": "signed_document_id",
  "publicKey": "base64_encoded_public_key"
}
```

**Response - Success (200) - Valid Signature:**
```json
{
  "fileName": "1640123456789-document.pdf",
  "signature": "base64_encoded_signature",
  "verify": true,
  "signedBy": {
    "uid": "user_firebase_uid",
    "email": "signer@example.com"
  },
  "fileURL": "https://supabase_public_url/file"
}
```

**Response - Success (200) - Invalid Signature:**
```json
{
  "fileName": "1640123456789-document.pdf",
  "signature": "base64_encoded_signature",
  "verify": false,
  "signedBy": {
    "uid": "user_firebase_uid",
    "email": "signer@example.com"
  },
  "error": "Signature is not valid."
}
```

**Response - Error (400):**
```json
{
  "verify": false,
  "error": "Document ID and Public Key are required."
}
```

**Response - Error (404):**
```json
{
  "verify": false,
  "error": "Document not found"
}
```

#### `GET /documents/:id` 🌐
Mengambil metadata dokumen berdasarkan ID (endpoint publik)

**Request:**
```http
GET /documents/signed_document_id
```

**Response - Success (200):**
```json
{
  "fileName": "1640123456789-document.pdf",
  "originalName": "document.pdf",
  "signature": "base64_encoded_signature",
  "signedBy": {
    "uid": "user_firebase_uid",
    "email": "signer@example.com"
  },
  "signedAt": "2024-01-15T10:30:00.000Z"
}
```

**Response - Error (404):**
```json
{
  "error": "Document not found"
}
```

---

## 📊 Data Models

### User Model
```typescript
interface User {
  uid: string;           // Firebase UID
  email: string;         // User email
  createdAt: Date;       // Registration timestamp
}
```

### KeyPair Model
```typescript
interface KeyPair {
  id: string;            // Firestore document ID
  userId: string;        // Firebase UID pemilik
  publicKey: string;     // Base64 encoded RSA public key
  privateKey: string;    // Base64 encoded RSA private key
  createdAt: string;     // ISO timestamp
}
```

### Document Model
```typescript
interface Document {
  id: string;            // Firestore document ID
  fileName: string;      // Unique filename di storage
  originalName: string;  // Nama file asli
  signature: string;     // Base64 encoded signature
  signedBy: {
    uid: string;         // Signer Firebase UID
    email: string;       // Signer email
  };
  signedAt: string;      // ISO timestamp
}
```

---

## 🚨 Error Codes

| Status Code | Description | Example |
|-------------|-------------|---------|
| **200** | Success | Request berhasil |
| **201** | Created | User berhasil dibuat |
| **400** | Bad Request | Parameter tidak lengkap/salah |
| **401** | Unauthorized | Token tidak ada |
| **403** | Forbidden | Token invalid/expired atau akses ditolak |
| **404** | Not Found | Resource tidak ditemukan |
| **500** | Internal Server Error | Server error |

---

## 🔧 Technical Specifications

### Cryptographic Details
- **Algorithm:** RSA with PKCS#8 format
- **Key Size:** 2048 bits
- **Hash Function:** SHA-256
- **Signature Format:** Base64 encoded
- **Public Key Format:** SPKI DER, Base64 encoded
- **Private Key Format:** PKCS#8 DER, Base64 encoded

### File Storage
- **Provider:** Supabase Storage
- **Bucket:** `filles`
- **File Naming:** `timestamp-originalname`
- **Access:** Public URLs untuk verified documents

### Database
- **Provider:** Firebase Firestore
- **Collections:** `keyPairs`, `documents`
- **Indexing:** `userId` field untuk performance

---

## 🧪 Testing Examples

### 1. Complete Workflow Example

```bash
# 1. Register user
curl -X POST http://localhost:5000/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# 2. Generate key pair (after getting JWT token)
curl -X GET http://localhost:5000/KeyGen \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# 3. Sign document
curl -X POST http://localhost:5000/sign \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@document.pdf" \
  -F "keyPairId=YOUR_KEYPAIR_ID"

# 4. Verify signature
curl -X POST http://localhost:5000/verify \
  -H "Content-Type: application/json" \
  -d '{"documentId":"DOCUMENT_ID","publicKey":"BASE64_PUBLIC_KEY"}'
```

### 2. JavaScript SDK Example

```javascript
// Frontend integration example
const signDocument = async (file, keyPairId, token) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('keyPairId', keyPairId);
  
  const response = await fetch('http://localhost:5000/sign', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });
  
  return response.json();
};

const verifyDocument = async (documentId, publicKey) => {
  const response = await fetch('http://localhost:5000/verify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ documentId, publicKey })
  });
  
  return response.json();
};
```

---

## 🛡️ Security Considerations

### Protected Endpoints
- Semua endpoint kecuali `/verify` dan `/documents/:id` memerlukan JWT token
- Token diverifikasi menggunakan Firebase Admin SDK
- User hanya bisa mengakses resource milik mereka sendiri

### Data Protection
- Private key disimpan terenkripsi di Firestore
- File disimpan di Supabase dengan unique naming
- CORS dikonfigurasi untuk membatasi origin

### Best Practices
- Selalu gunakan HTTPS di production
- Implementasikan rate limiting
- Log semua aktivitas signing untuk audit trail
- Backup private keys dengan encryption tambahan

---

## 📞 Support & Contact

Untuk pertanyaan atau issue terkait API, silakan hubungi tim development atau buat issue di repository project.

**Last Updated:** December 2024
**API Version:** 1.0.0 