import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { FiFileText, FiXCircle, FiLoader, FiDownload, FiKey, FiCheckCircle } from "react-icons/fi";
import { toast } from "react-hot-toast";

export default function VerifyPage() {
  const [document, setDocument] = useState(null);
  const [inputPublicKey, setInputPublicKey] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [verificationResult, setVerificationResult] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(''); // State untuk menyimpan URL unduhan
  const { id } = useParams();
  
  const debounceTimeout = useRef(null);

  // Efek 1: Ambil data dokumen saat halaman dimuat
  useEffect(() => {
    async function getDataById() {
      if (!id) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await axios.get(`http://localhost:5000/documents/${id}`);
        setDocument(res.data);
      } catch (err) {
        toast.error("Could not find a document with that ID.");
      } finally {
        setIsLoading(false);
      }
    }
    getDataById();
  }, [id]);

  // Efek 2: Picu verifikasi secara otomatis saat kunci publik dimasukkan
  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    
    if (document && inputPublicKey.trim() !== "") {
      debounceTimeout.current = setTimeout(() => {
        handleVerify();
      }, 1000);
    }

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [inputPublicKey, document]);


  // Fungsi untuk handle verifikasi
  async function handleVerify() {
    setIsLoading(true);
    setVerificationResult(null);
    setDownloadUrl(''); // Reset URL unduhan setiap verifikasi dimulai

    try {
      const payload = {
        documentId: id,
        publicKey: inputPublicKey,
      };
      const res = await axios.post(`http://localhost:5000/verify`, payload);
      setVerificationResult(res.data);

      if (res.data.verify) {
        toast.success("Verification Successful! The file is ready for download.");
        // Simpan URL unduhan ke state, jangan picu klik otomatis
        setDownloadUrl(res.data.fileURL);
      } else {
        toast.error(res.data.error || "Verification Failed. Invalid key or signature.");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || "An unknown error occurred.";
      setVerificationResult({ verify: false, error: errorMessage });
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }


  if (isLoading && !document) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-center text-text-muted">
        <FiLoader className="mr-4 h-8 w-8 animate-spin" />
        <span className="text-xl">Loading Document Data...</span>
      </div>
    );
  }

  if (!document) {
    return (
       <div className="flex min-h-[60vh] flex-col items-center justify-center text-center text-text-muted">
         <FiXCircle className="mb-4 h-16 w-16 text-red-500" />
         <h2 className="text-2xl font-bold text-text-light">Document Not Found</h2>
         <p>The link may be invalid or the document has been deleted.</p>
         <Link to="/sign" className="mt-6 rounded-lg bg-primary px-4 py-2 text-white hover:brightness-110">Go back to Sign Page</Link>
       </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <h1 className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
          Document Verification
        </h1>
        <p className="mt-2 flex items-center justify-center gap-2 text-text-muted">
          <FiFileText /> Verifying file: <strong>{document.originalName || document.fileName}</strong>
        </p>
      </div>
      
      <div className="w-full max-w-2xl rounded-2xl border border-border-color bg-card-bg p-8 shadow-2xl backdrop-blur-lg">
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="mb-2 text-lg font-semibold text-secondary">Document Signature</h2>
            <textarea rows="4" className="w-full rounded-lg bg-dark-bg p-3 text-sm text-text-muted" value={document.signature} readOnly />
          </div>

          <div>
            <h2 className="mb-2 flex items-center gap-2 text-lg font-semibold text-primary"><FiKey/> Your Public Key</h2>
            <textarea
              rows="6"
              className="w-full rounded-lg border border-border-color bg-dark-bg p-3 text-sm text-text-light focus:border-primary focus:ring-2 focus:ring-primary"
              value={inputPublicKey}
              onChange={(e) => setInputPublicKey(e.target.value)}
              placeholder="Paste the Public Key here to automatically start verification..."
            />
          </div>
          
          <div className="mt-4 flex min-h-[6rem] flex-col items-center justify-center rounded-lg border-2 border-dashed border-border-color p-4">
            {isLoading && (
              <div className="flex items-center text-text-muted"><FiLoader className="mr-3 animate-spin" /> Verifying...</div>
            )}
            
            {!isLoading && verificationResult?.verify && (
               <div className="text-center text-green-400">
                <div className="flex items-center justify-center">
                  <FiCheckCircle className="mr-3 h-6 w-6" />
                  <span>Verification successful.</span>
                </div>
                {downloadUrl && (
                  <a
                    href={downloadUrl}
                    download={document.originalName || 'verified-file'}
                    className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-secondary px-5 py-2 font-semibold text-dark-bg transition hover:brightness-110"
                    title="Download the verified file"
                  >
                    <FiDownload />
                    Download File
                  </a>
                )}
              </div>
            )}
            
            {!isLoading && verificationResult && !verificationResult.verify && (
               <div className="flex items-center text-red-400"><FiXCircle className="mr-3 h-6 w-6" /> Verification Failed.</div>
            )}
            
            {!isLoading && !verificationResult && (
               <div className="text-center text-text-muted">Waiting for Public Key...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}