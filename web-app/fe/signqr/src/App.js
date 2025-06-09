// src/App.js
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Sesuaikan nama import jika nama file Anda berbeda
import GenerateKeyPage from "./components/GenerateKey";
import GenerateSignaturePage from "./components/GenerateSign";
import VerifyIndexPage from "./pages/VerifyIndexPage";
import VerifyPage from "./pages/VerifyPage";


function App() {
  const linkStyle = "px-4 py-2 rounded-md text-sm font-semibold transition-colors duration-300";
  const activeLinkStyle = "bg-primary text-white";
  const inactiveLinkStyle = "text-text-muted hover:bg-card-bg hover:text-text-light";

  return (
    <BrowserRouter>
      {/* Container utama aplikasi */}
      <div className="min-h-screen w-full">
        {/* Notifikasi Toast */}
        <Toaster position="top-center" toastOptions={{
          style: { background: '#363636', color: '#fff' }
        }}/>

        {/* Navigasi Bar */}
        <header className="flex justify-center p-4">
          <nav className="flex items-center gap-x-2 rounded-lg border border-border-color bg-card-bg p-2 backdrop-blur-lg">
            <NavLink to="/" className={({ isActive }) => `${linkStyle} ${isActive ? activeLinkStyle : inactiveLinkStyle}`}>Generate Key</NavLink>
            <NavLink to="/sign" className={({ isActive }) => `${linkStyle} ${isActive ? activeLinkStyle : inactiveLinkStyle}`}>Generate Signature</NavLink>
            <NavLink to="/verify" className={({ isActive }) => `${linkStyle} ${isActive ? activeLinkStyle : inactiveLinkStyle}`}>Verify</NavLink>
          </nav>
        </header>

        {/* Konten Halaman */}
        <main className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<GenerateKeyPage />} />
            <Route path="/sign" element={<GenerateSignaturePage />} />
            <Route path="/verify" element={<VerifyIndexPage />} />
            <Route path="/verify/:id" element={<VerifyPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;