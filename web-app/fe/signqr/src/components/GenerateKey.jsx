import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiKey, FiCopy, FiCheckCircle, FiLoader } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext"; // <-- GUNAKAN AUTH CONTEXT

export default function GenerateKeyPage() {
  const [keyPairs, setKeyPairs] = useState([]); // <-- State untuk menyimpan daftar key
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [copiedInfo, setCopiedInfo] = useState({ id: null, type: null });

  const { idToken } = useAuth(); // <-- Ambil ID Token

  // Fungsi untuk mengambil semua key pair milik user
  const fetchKeys = async () => {
    if (!idToken) return;
    setIsFetching(true);
    try {
      const res = await axios.get("http://localhost:5000/my-keys", {
        headers: { 'Authorization': `Bearer ${idToken}` }
      });
      setKeyPairs(res.data);
    } catch (err) {
      toast.error("Gagal mengambil daftar kunci.");
    } finally {
      setIsFetching(false);
    }
  };
  
  // Ambil data kunci saat komponen pertama kali dimuat
  useEffect(() => {
    fetchKeys();
  }, [idToken]);

  // Fungsi untuk membuat key baru
  async function generateNewKey() {
    setIsLoading(true);
    try {
      await axios.get("http://localhost:5000/KeyGen", {
        headers: { 'Authorization': `Bearer ${idToken}` } // <-- KIRIM TOKEN
      });
      toast.success('Kunci baru berhasil dibuat!');
      await fetchKeys(); // Ambil ulang daftar kunci
    } catch (err) {
      toast.error('Gagal membuat kunci baru.');
    } finally {
      setIsLoading(false);
    }
  }

  function handleCopy(id, keyType, text) {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedInfo({ id, type: keyType });
      toast.success(`${keyType === 'public' ? 'Public Key' : 'Key ID'} disalin!`);
      setTimeout(() => setCopiedInfo({ id: null, type: null }), 2000);
    });
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <h1 className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
          Your Key Pairs
        </h1>
        <p className="mt-2 text-text-muted">Manage your public keys. Private keys are stored securely on the server.</p>
      </div>
      <div className="w-full max-w-4xl">
        <div className="flex justify-center mb-6">
          <button onClick={generateNewKey} disabled={isLoading} className="group flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-primary to-accent px-8 py-3 text-lg font-bold text-white shadow-lg transition-transform duration-300 hover:scale-105 disabled:opacity-50">
            {isLoading ? <FiLoader className="animate-spin" /> : <FiKey />}
            {isLoading ? 'Generating...' : 'Generate New Key Pair'}
          </button>
        </div>
        
        <div className="rounded-2xl border border-border-color bg-card-bg p-8 shadow-2xl backdrop-blur-lg">
          <h2 className="text-2xl font-bold mb-4 text-white">My Stored Keys</h2>
          {isFetching ? <div className="text-center text-text-muted">Loading keys...</div> :
            keyPairs.length === 0 ? <div className="text-center text-text-muted">You don't have any key pairs yet. Generate one!</div> :
            <div className="space-y-4">
              {keyPairs.map(key => (
                <div key={key.id} className="p-4 rounded-lg bg-dark-bg border border-border-color">
                   <p className="text-sm text-text-muted mb-2 font-mono">Key ID: {key.id}</p>
                   <textarea rows="3" className="w-full rounded-md bg-black/30 p-2 text-sm text-text-light font-mono" readOnly value={key.publicKey} />
                   <button onClick={() => handleCopy(key.id, 'public', key.publicKey)} className="mt-2 flex items-center gap-2 text-sm text-secondary hover:text-primary">
                      {copiedInfo.id === key.id && copiedInfo.type === 'public' ? <FiCheckCircle /> : <FiCopy />}
                      {copiedInfo.id === key.id && copiedInfo.type === 'public' ? 'Copied!' : 'Copy Public Key'}
                   </button>
                </div>
              ))}
            </div>
          }
        </div>
      </div>
    </div>
  );
}