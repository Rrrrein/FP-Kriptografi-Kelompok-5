// src/pages/GenerateKey.jsx

import React, { useState } from "react";
import axios from "axios";

// 1. Import Ikon dan Notifikasi "Toast"
import { FiKey, FiCopy, FiCheckCircle, FiLoader } from "react-icons/fi";
import { toast } from "react-hot-toast";

export default function GenerateKeyPage() {
  // 2. State yang lebih deskriptif
  const [privateKey, setPrivateKey] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Untuk state loading
  const [copiedKey, setCopiedKey] = useState(null); // Untuk feedback tombol copy

  // 3. Fungsi API yang lebih modern dengan async/await dan try/catch
  async function getKey() {
    setIsLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/KeyGen");
      setPublicKey(res.data.publicKey);
      setPrivateKey(res.data.privateKey);
      toast.success('New keys generated successfully!');
    } catch (err) {
      console.error("Failed to generate keys:", err);
      toast.error('Failed to generate keys. Please check the server.');
    } finally {
      setIsLoading(false);
    }
  }

  // 4. Fungsi Copy yang modern menggunakan Navigator API
  function handleCopy(keyType, text) {
    if (!text) return; // Jangan lakukan apa-apa jika teks kosong
    
    navigator.clipboard.writeText(text).then(() => {
      setCopiedKey(keyType);
      toast.success(`${keyType === 'public' ? 'Public Key' : 'Private Key'} copied to clipboard!`);
      // Reset ikon dan teks tombol setelah 2 detik
      setTimeout(() => setCopiedKey(null), 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      toast.error('Failed to copy text.');
    });
  }

  // 5. Struktur JSX yang sepenuhnya baru dengan kelas Tailwind dari tema modern
  return (
    <div className="flex flex-col items-center justify-center p-4">
      {/* Judul Halaman dengan Efek Gradasi */}
      <div className="mb-8 text-center">
        <h1 className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
          Digital Identity Generator
        </h1>
        <p className="mt-2 text-text-muted">Create your secure Public & Private key pair.</p>
      </div>

      {/* Kartu "Kaca" utama */}
      <div className="w-full max-w-4xl rounded-2xl border border-border-color bg-card-bg p-8 shadow-2xl backdrop-blur-lg">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          
          {/* Kartu Public Key */}
          <div className="flex flex-col">
            <h2 className="mb-3 text-center text-xl font-semibold text-secondary">Public Key</h2>
            <textarea
              rows="6"
              className="w-full flex-grow rounded-lg border border-border-color bg-dark-bg p-3 text-sm text-text-light focus:border-secondary focus:ring-2 focus:ring-secondary"
              readOnly
              value={publicKey}
              placeholder="Your public key will appear here..."
            />
            <button
              onClick={() => handleCopy('public', publicKey)}
              disabled={!publicKey}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-secondary px-4 py-2 font-semibold text-dark-bg transition-all duration-300 hover:brightness-110 disabled:cursor-not-allowed disabled:bg-text-muted"
            >
              {copiedKey === 'public' ? <FiCheckCircle /> : <FiCopy />}
              {copiedKey === 'public' ? 'Copied!' : 'Copy Public Key'}
            </button>
          </div>

          {/* Kartu Private Key */}
          <div className="flex flex-col">
            <h2 className="mb-3 text-center text-xl font-semibold text-primary">Private Key</h2>
            <textarea
              rows="6"
              className="w-full flex-grow rounded-lg border border-border-color bg-dark-bg p-3 text-sm text-text-light focus:border-primary focus:ring-2 focus:ring-primary"
              readOnly
              value={privateKey}
              placeholder="Your private key will appear here..."
            />
            <button
              onClick={() => handleCopy('private', privateKey)}
              disabled={!privateKey}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 font-semibold text-white transition-all duration-300 hover:brightness-110 disabled:cursor-not-allowed disabled:bg-text-muted"
            >
              {copiedKey === 'private' ? <FiCheckCircle /> : <FiCopy />}
              {copiedKey === 'private' ? 'Copied!' : 'Copy Private Key'}
            </button>
          </div>
        </div>

        {/* Tombol Generate Utama yang Interaktif */}
        <div className="mt-10 flex justify-center">
          <button
            onClick={getKey}
            disabled={isLoading}
            className="group flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-primary to-accent px-8 py-3 text-lg font-bold text-white shadow-lg transition-transform duration-300 hover:scale-105 disabled:bg-gradient-to-r disabled:from-text-muted disabled:to-text-muted disabled:hover:scale-100"
          >
            {isLoading 
              ? <FiLoader className="animate-spin" /> 
              : <FiKey className="transition-transform duration-300 group-hover:rotate-12" />
            }
            {isLoading ? 'Generating...' : 'Generate New Keys'}
          </button>
        </div>
      </div>
    </div>
  );
}