# Final Project Kriptografi - Digital Signature

## Anggota Kelompok 5

| No | Nama Anggota        | NIM           | Jobdesc                          |
|----|---------------------|---------------|----------------------------------|
| 1. | M. Abhinaya         | 5027231011    |                                  |
| 2. | Aswalia Novitriasari| 5027231012    |                                  |
| 3. | Ricko Mianto        | 5027231031    |                                  |
| 4. | Agnes Zenobia G P   | 5027231034    |                                  |
| 5. | Nayla Raissa A      | 5027231054    |                                  |
| 6. | Aisha Ayya R        | 5027231056    |                                  |
| 7. | Aisyah Rahmasari    | 5027231072    |                                  |


# 📄 Sign-QR: Sistem Tanda Tangan & Verifikasi Dokumen Digital

Sign-QR adalah aplikasi web modern yang menyediakan alur kerja lengkap untuk mengamankan dokumen digital. Pengguna dapat membuat identitas kriptografis mereka sendiri (pasangan kunci RSA), menandatangani file secara digital untuk menjamin keaslian dan integritas, serta memverifikasi dokumen melalui tautan unik yang disematkan dalam QR Code.

Proyek ini mengimplementasikan konsep kriptografi asimetris dalam antarmuka yang bersih, interaktif, dan ramah pengguna.

<!-- Ganti dengan URL screenshot halaman utama Anda -->
![Screenshot Sign-QR](URL_SCREENSHOT)

---

## 📑 Daftar Isi

- [Deskripsi Proyek](#deskripsi-proyek)
- [Arsitektur Sistem](#arsitektur-sistem)
- [Algoritma Inti: RSA](#algoritma-inti-rsa)
- [Anggota Kelompok](#anggota-kelompok)
- [Teknologi yang Digunakan](#teknologi-yang-digunakan)
- [Cara Menjalankan Aplikasi](#cara-menjalankan-aplikasi)
- [Dokumentasi & Alur Kerja Aplikasi](#dokumentasi--alur-kerja-aplikasi)

---

## 🧩 Deskripsi Proyek

Di era digital, memastikan bahwa sebuah dokumen tidak diubah dan benar-benar berasal dari pengirim yang sah adalah tantangan besar. Proyek **Sign-QR** menjawab tantangan ini dengan menyediakan platform yang memungkinkan pengguna untuk:

- **Membuat Identitas Digital**: Menghasilkan pasangan kunci RSA (Publik & Privat) yang unik untuk setiap pengguna.
- **Menandatangani Dokumen**: Menggunakan Kunci Privat untuk membuat "sidik jari" digital pada sebuah file.
- **Menghasilkan QR Code Verifikasi**: Membuat QR Code yang berisi tautan unik ke halaman verifikasi.
- **Memverifikasi Dokumen**: Pengguna cukup memasukkan Kunci Publik pengirim untuk memverifikasi integritas dokumen.

---

## 🏗️ Arsitektur Sistem

Aplikasi ini dibangun menggunakan arsitektur 2-tier (Client-Server):

 **Frontend**: Dibuat dengan React. Mengatur UI dan interaksi pengguna.
- **Backend**: Node.js & Express. Mengelola logika kriptografi, pengelolaan file, dan komunikasi dengan Firebase.
- **Firebase**: Digunakan untuk Firestore (penyimpanan metadata) dan Cloud Storage (penyimpanan file).

---

## 🔐 Algoritma Inti: RSA

**RSA (Rivest–Shamir–Adleman)** adalah inti dari sistem keamanan aplikasi ini:

- **Kunci Privat**: Digunakan untuk membuat tanda tangan digital.
- **Kunci Publik**: Digunakan untuk memverifikasi tanda tangan digital.
  
### Proses:

- `Tanda Tangan` = `Hash(Dokumen)` dienkripsi dengan `Kunci Privat`
- `Verifikasi` = Decrypt `Tanda Tangan` dengan `Kunci Publik`, bandingkan dengan `Hash(Dokumen)`

Jika satu bit saja dari dokumen diubah, verifikasi akan gagal.

---

## 🚀 Cara Menjalankan Aplikasi

### 🔧 Prasyarat

- Node.js v16+
- NPM atau Yarn

### 1. Jalankan Backend

```bash
cd web-app/be
npm install
node index.js
```
Backend berjalan di: http://localhost:5000

### 2. Jalankan Fr

```bash
cd web-app/fe/signqr
npm install
npm start
```
Frontend berjalan di: http://localhost:3000

