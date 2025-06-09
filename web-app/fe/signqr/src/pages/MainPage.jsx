// src/pages/MainPage.jsx

import React from 'react';
import { Link } from 'react-router-dom';

// 1. Import Ikon untuk setiap langkah dalam proses
import { FiKey, FiPenTool, FiCheckSquare, FiArrowRight } from 'react-icons/fi';

export default function MainPage() {
  // 2. Data untuk "How It Works" agar kode lebih bersih
  const steps = [
    {
      icon: <FiKey className="h-10 w-10 text-secondary" />,
      title: "1. Generate Identity",
      description: "Create your unique and secure pair of Public and Private Keys. Your keys are your digital identity.",
    },
    {
      icon: <FiPenTool className="h-10 w-10 text-primary" />,
      title: "2. Sign Document",
      description: "Use your Private Key to create a unique digital signature for any file, proving its authenticity and integrity.",
    },
    {
      icon: <FiCheckSquare className="h-10 w-10 text-green-400" />,
      title: "3. Verify Signature",
      description: "Anyone can use your Public Key to verify that your signature is valid and the document hasn't been tampered with.",
    },
  ];

  // 3. Struktur JSX yang sepenuhnya baru untuk sebuah Landing Page
  return (
    <div className="flex flex-col items-center justify-center p-4 text-center">
      
      {/* Hero Section - Bagian Sambutan Utama */}
      <div className="mt-10 mb-20">
        <h1 className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-5xl font-extrabold text-transparent sm:text-6xl md:text-7xl">
          Secure Your Digital World
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-text-muted md:text-xl">
          Create, sign, and verify documents with the power of RSA cryptography. An end-to-end solution for digital integrity.
        </p>
        
        {/* Tombol Call-to-Action (CTA) */}
        <div className="mt-8">
          <Link
            to="/key" // Arahkan ke halaman Generate Key
            className="group inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-primary to-accent px-8 py-4 text-lg font-bold text-white shadow-lg transition-transform duration-300 hover:scale-105"
          >
            Get Started - Generate Keys
            <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* "How It Works" Section - Penjelasan Alur Kerja */}
      <div className="w-full max-w-5xl">
        <h2 className="mb-12 text-3xl font-bold text-text-light">How It Works in 3 Simple Steps</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          
          {/* Mapping data 'steps' untuk membuat kartu secara dinamis */}
          {steps.map((step, index) => (
            <div 
              key={index}
              className="flex flex-col items-center rounded-2xl border border-border-color bg-card-bg p-8 text-center shadow-2xl backdrop-blur-lg transition-all duration-300 hover:-translate-y-2 hover:border-secondary"
            >
              <div className="mb-4 rounded-full bg-dark-bg p-4">
                {step.icon}
              </div>
              <h3 className="mb-2 text-xl font-semibold text-text-light">{step.title}</h3>
              <p className="text-sm text-text-muted">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}