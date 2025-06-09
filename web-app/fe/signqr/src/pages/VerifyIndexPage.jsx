// src/pages/VerifyIndexPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiLogIn } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

export default function VerifyIndexPage() {
    const [documentId, setDocumentId] = useState('');
    const navigate = useNavigate();

    function handleNavigate() {
        if (documentId.trim()) {
            navigate(`/verify/${documentId}`);
        } else {
            toast.error('Please enter a Document ID.');
        }
    }

    function handleKeyPress(event) {
        if (event.key === 'Enter') {
            handleNavigate();
        }
    }

    return (
        <div className="flex flex-col items-center justify-center p-4">
            <div className="mb-8 text-center">
                <h1 className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
                    Verify a Document
                </h1>
                <p className="mt-2 text-text-muted">Enter a document's unique ID to check its authenticity.</p>
            </div>
            <div className="w-full max-w-xl rounded-2xl border border-border-color bg-card-bg p-8 shadow-2xl backdrop-blur-lg">
                <h2 className="mb-2 text-center text-xl font-semibold text-text-light">Find Your Document</h2>
                <p className="mb-6 text-center text-sm text-text-muted">
                    This ID is from the QR Code URL or can be found in your database.
                </p>
                <div className="flex flex-col items-center gap-4 sm:flex-row">
                    <div className="relative w-full">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                        <input
                            type="text"
                            className="w-full rounded-lg border border-border-color bg-dark-bg py-3 pl-10 pr-4 text-sm text-text-light focus:border-primary focus:ring-2 focus:ring-primary"
                            value={documentId}
                            onChange={(e) => setDocumentId(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Paste Document ID here..."
                        />
                    </div>
                    <button
                        onClick={handleNavigate}
                        className="group flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 font-semibold text-white transition-all duration-300 hover:brightness-110 sm:w-auto"
                        title="Verify Document"
                    >
                        Verify <FiLogIn className="transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                </div>
            </div>
        </div>
    );
}