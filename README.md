# Final Project Kriptografi - Digital Signature

## Anggota Kelompok 5

| No | Nama Anggota        | NRP           | Jobdesc                          |
|----|---------------------|---------------|----------------------------------|
| 1. | M. Abhinaya         | 5027231011    | Backend                          |
| 2. | Aswalia Novitriasari| 5027231012    | Frontend                         |
| 3. | Ricko Mianto        | 5027231031    | Backend                          |
| 4. | Agnes Zenobia G P   | 5027231034    | Frontend                         |
| 5. | Nayla Raissa A      | 5027231054    | Frontend                         |
| 6. | Aisha Ayya R        | 5027231056    | FrontEnd                         |
| 7. | Aisyah Rahmasari    | 5027231072    | FrontEnd                         |


# Sign-QR: Sistem Tanda Tangan & Verifikasi Dokumen Digital

Sign-QR adalah aplikasi web modern yang menyediakan alur kerja lengkap untuk mengamankan dokumen digital, memastikan setiap transaksi atau dokumen yang diproses terlindungi dengan aman. Pengguna dapat membuat identitas kriptografis mereka sendiri (pasangan kunci RSA), menandatangani file secara digital untuk menjamin keaslian dan integritas, serta memverifikasi dokumen melalui tautan unik yang disematkan dalam QR Code, yang dapat dipindai untuk validasi langsung.

Proyek ini mengimplementasikan konsep kriptografi asimetris dalam antarmuka yang bersih, interaktif, dan ramah pengguna.

---

## Deskripsi Proyek

Di era digital, memastikan bahwa sebuah dokumen tidak diubah dan benar-benar berasal dari pengirim yang sah adalah tantangan besar. Proyek **Sign-QR** menjawab tantangan ini dengan menyediakan platform yang memungkinkan pengguna untuk:

- **Membuat Identitas Digital**: Menghasilkan pasangan kunci RSA (Publik & Privat) yang unik untuk setiap pengguna.
- **Menandatangani Dokumen**: Menggunakan Kunci Privat untuk membuat "sidik jari" digital pada sebuah file.
- **Menghasilkan QR Code Verifikasi**: Membuat QR Code yang berisi tautan unik ke halaman verifikasi.
- **Memverifikasi Dokumen**: Pengguna cukup memasukkan Kunci Publik pengirim untuk memverifikasi integritas dokumen.

---

## Arsitektur Sistem

Aplikasi ini dibangun menggunakan arsitektur 2-tier (Client-Server):

 **Frontend**: Dibuat dengan React. Mengatur UI dan interaksi pengguna.
- **Backend**: Node.js & Express. Mengelola logika kriptografi, pengelolaan file, dan komunikasi dengan Firebase.
- **Firebase**: Digunakan untuk Firestore (penyimpanan metadata) dan Cloud Storage (penyimpanan file).

---

## Algoritma Inti: RSA & SHA-256

Inti dari sistem keamanan aplikasi ini adalah kombinasi dari fungsi hash **SHA-256** dan algoritma kriptografi asimetris **RSA (Rivest–Shamir–Adleman)**.

- **SHA-256**: Digunakan untuk membuat *hash* (intisari digital) yang unik dari konten dokumen. Jika satu bit saja dari dokumen berubah, nilai hash akan berubah total.
- **Kunci Privat (RSA)**: Digunakan untuk mengenkripsi *hash* dokumen. Proses inilah yang disebut "membuat tanda tangan digital".
- **Kunci Publik (RSA)**: Dibagikan secara bebas dan digunakan untuk mendekripsi tanda tangan, lalu membandingkan hash-nya dengan hash dokumen asli untuk verifikasi.

### Proses:

- `Tanda Tangan` = `SHA-256(Dokumen)` dienkripsi dengan `Kunci Privat`
- `Verifikasi` = Dekripsi `Tanda Tangan` dengan `Kunci Publik`, lalu bandingkan hasilnya dengan `SHA-256(Dokumen)`
---

## Cara Menjalankan Aplikasi

### Konfigurasi Firebase

Sebelum menjalankan backend, Anda perlu menghubungkan aplikasi ke project Firebase Anda.

> **PENTING:**
> 1. Dapatkan file kredensial `serviceAccountKey.json` dari konsol Firebase Anda.
> 2. Letakkan file tersebut di dalam folder root backend (`web-app/be`).
>
> *File ini tidak disertakan dalam repositori untuk menjaga keamanan kredensial proyek.*

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

![Screenshot 2025-06-09 162959](https://github.com/user-attachments/assets/f8a3f14a-f463-4447-801b-4b8c120fdb60)

### 2. Jalankan Frontend

```bash
cd web-app/fe/signqr
npm install
npm start
```
Frontend berjalan di: http://localhost:3000

### 1. Halaman Utama & Pembuatan Kunci
User disambut di `main page`. Untuk memulai, pengguna harus membuat identitas digital dengan menavigasi ke halaman "Buat Kunci" dan menghasilkan pasangan kunci RSA.

![Screenshot 2025-06-09 163150](https://github.com/user-attachments/assets/4a6e4de0-6791-434b-94d6-43fa69e3d591)

### 2. Proses Penandatanganan Dokumen
Setelah memiliki kunci, pengguna dapat mengunggah dokumen (misalnya .txt), lalu menandatanganinya menggunakan Kunci Privat mereka. Aplikasi akan menghasilkan sebuah QR Code.

![Screenshot 2025-06-09 163209](https://github.com/user-attachments/assets/ed2e8f1e-d75b-467d-8de5-97758ba801f8)

### 3. Halaman Verifikasi
QR Code tersebut berisi tautan unik ke halaman verifikasi. Pihak ketiga dapat memindai QR code atau mengunjungi tautan tersebut, mengunggah dokumen asli, dan memasukkan Kunci Publik pengirim untuk memverifikasi keasliannya.

![Screenshot 2025-06-09 163222](https://github.com/user-attachments/assets/2d432243-2eff-490c-8184-29915844e25f)

