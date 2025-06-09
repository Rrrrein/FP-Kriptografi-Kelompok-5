// src/pages/GenerateSign.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import QRCode from "qrcode";

// Import Ikon dan Notifikasi "Toast"
import { FiUploadCloud, FiKey, FiPenTool, FiCopy, FiCheckCircle, FiLoader, FiDownload, FiSmartphone } from "react-icons/fi";
import { toast } from "react-hot-toast";

export default function GenerateSignaturePage() {
  // 1. State disederhanakan. 'signature' akan menjadi null atau object
  const [inputFile, setInputFile] = useState(null);
  const [privateKey, setPrivateKey] = useState("");
  const [signatureData, setSignatureData] = useState(null); // Menyimpan { text, id }
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // =================================================================
  // PERBAIKAN UTAMA DI SINI
  // useEffect ini sekarang membuat QR Code dari URL verifikasi
  // =================================================================
  useEffect(() => {
    async function generateQrFromUrl(url) {
      if (!url) return;
      try {
        const qrCodeDataUrl = await QRCode.toDataURL(url, { width: 256, margin: 2 });
        setImageUrl(qrCodeDataUrl);
      } catch (err) {
        console.error("Failed to generate QR Code:", err);
      }
    }

    // Hanya jalankan jika kita punya data signature yang berisi ID
    if (signatureData && signatureData.id) {
      // Buat URL verifikasi yang benar
      const verificationUrl = `http://localhost:3000/verify/${signatureData.id}`;
      console.log("Generating QR Code for URL:", verificationUrl); // Untuk debugging
      generateQrFromUrl(verificationUrl);
    }
  }, [signatureData]); // Bergantung pada signatureData

  // Fungsi Generate yang disempurnakan
  async function handleGenerate() {
    if (!inputFile || !privateKey) {
      toast.error("Please select a file and provide your private key.");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", inputFile);
    formData.append("privateKey", privateKey);

    try {
      const res = await axios.post("http://localhost:5000/sign", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      // Simpan seluruh objek yang berisi signature dan ID
      setSignatureData({ text: res.data.signature, id: res.data.id });
      toast.success("Signature and QR Code generated successfully!");

    } catch (err) {
      const errorMessage = err.response?.data?.error || "An unknown error occurred.";
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }

  // Fungsi Copy yang disempurnakan
  function handleCopy() {
    if (!signatureData?.text) return;
    navigator.clipboard.writeText(signatureData.text).then(() => {
      setCopied(true);
      toast.success("Signature copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    });
  }

  // Fungsi untuk mereset state saat file diubah
  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      setInputFile(file);
      setSignatureData(null); // Reset output saat file baru dipilih
      setImageUrl("");
    }
  }

  // Struktur JSX (sudah diperbarui)
  return (
    <div className="flex flex-col items-center justify-center p-4">
      {/* ... (Judul tidak berubah) ... */}
      <div className="mb-8 text-center">
        <h1 className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
          Generate Digital Signature
        </h1>
        <p className="mt-2 text-text-muted">Sign your document with your private key to prove its authenticity.</p>
      </div>

      <div className="w-full max-w-5xl rounded-2xl border border-border-color bg-card-bg p-8 shadow-2xl backdrop-blur-lg">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* ... (Kolom Input tidak berubah) ... */}
          <div className="flex flex-col gap-6">
             <div>
              <h2 className="mb-3 flex items-center gap-2 text-xl font-semibold text-secondary"><FiUploadCloud /> <span>Step 1: Upload Your Data</span></h2>
              <label htmlFor="file-upload" className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border-color bg-dark-bg p-6 text-center transition hover:border-secondary">
                <FiUploadCloud className="mb-2 h-10 w-10 text-text-muted" />
                <span className="font-semibold text-text-light">Click to upload a file</span>
                <p className="text-xs text-text-muted">Any file type is supported</p>
              </label>
              <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} />
              {inputFile && <div className="mt-3 w-full rounded-md bg-green-500/10 p-2 text-center text-sm text-green-400">File selected: <strong>{inputFile.name}</strong></div>}
            </div>
            <div>
              <h2 className="mb-3 flex items-center gap-2 text-xl font-semibold text-primary"><FiKey /> <span>Step 2: Provide Your Key</span></h2>
              <textarea rows="6" className="w-full rounded-lg border border-border-color bg-dark-bg p-3 text-sm text-text-light focus:border-primary focus:ring-2 focus:ring-primary" value={privateKey} onChange={(e) => setPrivateKey(e.target.value)} placeholder="Paste your private key here..."/>
            </div>
          </div>

          {/* Kolom Hasil */}
          <div className="flex flex-col">
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
        
        {/* Tombol Generate Utama */}
        <div className="mt-10 flex justify-center">
           <button onClick={handleGenerate} disabled={isLoading || !inputFile || !privateKey} className="group flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-primary to-accent px-8 py-3 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 disabled:cursor-not-allowed disabled:bg-gradient-to-r disabled:from-text-muted disabled:to-text-muted disabled:hover:scale-100">
            {isLoading ? <FiLoader className="animate-spin" /> : <FiPenTool />}
            {isLoading ? 'Generating...' : 'Generate Signature'}
          </button>
        </div>
      </div>
    </div>
  );
}