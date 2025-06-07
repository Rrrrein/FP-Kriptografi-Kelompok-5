import React, { useState, useEffect } from "react";
import axios from "axios";
import QRCode from "qrcode";

export default function GenerateSignature() {
  // 1. State disederhanakan
  const [inputFile, setInputFile] = useState(null);
  const [privateKey, setPrivateKey] = useState(""); // Hanya untuk private key
  const [signature, setSignature] = useState("");
  const [signatureId, setSignatureId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isGeneratedSign, setIsGeneratedSign] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // State untuk loading

  // Fungsi untuk membuat QR Code (Tidak perlu diubah)
  useEffect(() => {
    const generateQRCode = async (url) => {
      try {
        const resp = await QRCode.toDataURL(url);
        return resp;
      } catch (err) {
        console.log(err);
        return null;
      }
    };

    if (signatureId) {
      const qrUrl = `http://localhost:3000/verify/${signatureId}`;
      generateQRCode(qrUrl).then((imageUrl) => setImageUrl(imageUrl));
    }
  }, [signatureId]);

  // 2. Fungsi utama untuk men-generate signature (DITULIS ULANG TOTAL)
  async function handleGenerate() {
    // Validasi input
    if (!inputFile || !privateKey) {
      alert("Harap pilih file dan masukkan kunci privat Anda.");
      return;
    }

    setIsLoading(true); // Mulai loading

    // Buat objek FormData untuk mengirim file dan teks bersamaan
    const formData = new FormData();
    formData.append("file", inputFile); // 'file' harus cocok dengan upload.single("file") di backend
    formData.append("privateKey", privateKey);

    try {
      // Kirim satu permintaan ke endpoint /sign
      const res = await axios.post("http://localhost:5000/sign", formData, {
        headers: {
          // Header ini WAJIB untuk mengirim file
          "Content-Type": "multipart/form-data",
        },
      });

      // Jika berhasil, update state dengan data dari backend
      const { signature, id: signatureId } = res.data;
      setSignature(signature);
      setSignatureId(signatureId);
      setIsGeneratedSign(true);
      alert("Tanda tangan dan QR Code berhasil dibuat!");

    } catch (err) {
      // Tangkap dan tampilkan error dari backend
      console.error("Gagal membuat tanda tangan:", err);
      const errorMessage = err.response?.data?.error || "Terjadi kesalahan yang tidak diketahui.";
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false); // Hentikan loading, baik berhasil maupun gagal
    }
  }

  // Fungsi untuk handle perubahan file (Tidak perlu diubah)
  function handleFileChange(e) {
    setInputFile(e.target.files[0]);
    setIsGeneratedSign(false); // Reset jika file diubah
    setSignature("");
    setImageUrl("");
  }

  // Fungsi untuk copy (Tidak perlu diubah)
  function handleCopy(text) {
    if (!text) return; // Jangan lakukan apa-apa jika teks kosong
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  }

  return (
    <div className="mx-auto mb-24 flex w-fit flex-col rounded-lg bg-igreen p-8 px-10 shadow-2xl sm:px-20 lg:px-28">
      <span className="mx-auto mb-6 text-xl font-bold text-white lg:text-3xl">
        Generate Signature
      </span>

      {/* 3. BAGIAN UPLOAD FILE DISERDEHANAKAN */}
      <div className="mb-6 lg:px-28">
        <div className="flex w-full flex-col rounded-lg bg-white px-16 py-3">
          <span className="mx-auto mb-3 text-base font-bold text-ipurple lg:text-lg">
            Data
          </span>
          <input
            className="mb-3 block w-full cursor-pointer rounded-sm border-2 bg-gray-100 text-sm text-gray-600 focus:outline-none"
            type="file"
            onChange={handleFileChange}
          />
          {/* Tombol Upload dihapus karena tidak diperlukan lagi */}
          {inputFile && (
             <p className="mx-auto text-sm font-semibold text-igreen">
              File: {inputFile.name}
            </p>
          )}
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-y-5 lg:gap-x-8">
        <div className="flex flex-col gap-2 rounded-lg bg-white px-7 py-4 lg:px-12 lg:pb-8">
          <span className="mx-auto text-base font-bold text-ipurple lg:text-lg">
            Private Key
          </span>
          {/* 4. Textarea dihubungkan ke state 'privateKey' yang baru */}
          <textarea
            rows="4"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-6 py-3 text-sm"
            value={privateKey}
            onChange={(event) => setPrivateKey(event.target.value)}
            placeholder="Input your private key"
          />
        </div>
      </div>

      <div className="mb-6 w-full px-10 lg:px-32">
        <div className="flex flex-col gap-3 rounded-lg bg-white px-7 py-4 lg:px-12">
          <span className="mx-auto text-base font-bold text-ipurple lg:text-lg">
            Signature
          </span>
          <textarea
            rows="1"
            className="mb-2 block w-full rounded-lg border border-gray-300 bg-gray-50 p-6 py-3 text-sm"
            value={signature}
            readOnly
            placeholder="Signature will be generated here"
          />
          {isGeneratedSign && imageUrl && (
            <a href={imageUrl} download="signature-qrcode.png" className="mx-auto mb-2 h-full">
              <img src={imageUrl} alt="QRCODE" />
            </a>
          )}
          <button
            onClick={() => handleCopy(signature)}
            className="text-yellow mx-auto w-fit rounded-lg bg-igreen px-3 py-1 text-sm font-bold text-white"
          >
            Copy
          </button>
        </div>
      </div>

      {/* 5. Tombol 'Generate' sekarang memanggil fungsi yang sudah diperbaiki */}
      <button
        onClick={handleGenerate}
        className="mx-auto mb-3 w-fit rounded-lg bg-iyellow px-3 py-2 font-bold text-ipurple disabled:opacity-50"
        type="button"
        disabled={isLoading} // Tombol dinonaktifkan saat loading
      >
        {isLoading ? "Generating..." : "Generate"}
      </button>

      {isGeneratedSign && (
        <div className=" mx-auto w-fit rounded-xl border-2 border-iyellow px-3 py-[0.2rem]">
          <p className=" font-semibold text-white">
            Signature & QR code generated !!
          </p>
        </div>
      )}
    </div>
  );
}