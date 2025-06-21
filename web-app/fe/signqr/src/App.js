// src/App.js
import { BrowserRouter, Routes, Route, NavLink, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./context/AuthContext";
import { auth } from "./firebase/config";

// Import semua halaman dan komponen Anda
import MainPage from "./pages/MainPage";
import GenerateKeyPage from "./components/GenerateKey";
import GenerateSignaturePage from "./components/GenerateSign";
import VerifyIndexPage from "./pages/VerifyIndexPage";
import VerifyPage from "./pages/VerifyPage";
import AuthPage from "./pages/AuthPage";

// Komponen untuk melindungi rute, tidak ada perubahan di sini
const ProtectedRoute = ({ children }) => {
    const { currentUser } = useAuth();
    if (!currentUser) {
        return <Navigate to="/auth" replace />;
    }
    return children;
};

function App() {
  const { currentUser } = useAuth();

  const handleLogout = () => {
    auth.signOut();
  };

  const linkStyle = "px-4 py-2 rounded-md text-sm font-semibold transition-colors duration-300";
  const activeLinkStyle = "bg-primary text-white";
  const inactiveLinkStyle = "text-text-muted hover:bg-card-bg hover:text-text-light";

  return (
    <BrowserRouter>
      <div className="min-h-screen w-full">
        <Toaster position="top-center" toastOptions={{ style: { background: '#363636', color: '#fff' } }}/>
        
        <header className="flex justify-between items-center p-4">
          {/* DIUBAH: Logo sekarang menjadi link ke halaman utama publik */}
          <NavLink to="/" className="text-xl font-bold text-white">SignQR</NavLink>
          
          <nav className="flex items-center gap-x-2 rounded-lg border border-border-color bg-card-bg p-2 backdrop-blur-lg">
            {currentUser ? (
              <>
                {/* DIUBAH: Link "Generate Key" sekarang mengarah ke /keys */}
                <NavLink to="/keys" className={({ isActive }) => `${linkStyle} ${isActive ? activeLinkStyle : inactiveLinkStyle}`}>Generate Key</NavLink>
                <NavLink to="/sign" className={({ isActive }) => `${linkStyle} ${isActive ? activeLinkStyle : inactiveLinkStyle}`}>Generate Signature</NavLink>
                <NavLink to="/verify" className={({ isActive }) => `${linkStyle} ${isActive ? activeLinkStyle : inactiveLinkStyle}`}>Verify</NavLink>
              </>
            ) : (
              <NavLink to="/verify" className={({ isActive }) => `${linkStyle} ${isActive ? activeLinkStyle : inactiveLinkStyle}`}>Verify</NavLink>
            )}
          </nav>
          
          <div>
            {currentUser ? (
               <button onClick={handleLogout} className={`${linkStyle} ${inactiveLinkStyle} bg-red-500/10 text-red-400 hover:bg-red-500/20`}>Logout</button>
            ) : (
               <NavLink to="/auth" className={`${linkStyle} ${activeLinkStyle}`}>Login / Register</NavLink>
            )}
          </div>
        </header>

        <main className="container mx-auto p-4">
          <Routes>
              {/* === PERUBAHAN UTAMA PADA STRUKTUR RUTE === */}

              {/* Rute Publik */}
              <Route path="/" element={<MainPage />} />
              <Route path="/auth" element={currentUser ? <Navigate to="/keys" /> : <AuthPage />} /> {/* DIUBAH: Redirect ke /keys setelah login */}
              <Route path="/verify" element={<VerifyIndexPage />} />
              <Route path="/verify/:id" element={<VerifyPage />} />

              {/* Rute yang Dilindungi */}
              <Route path="/keys" element={<ProtectedRoute><GenerateKeyPage /></ProtectedRoute>} /> {/* BARU: Rute terproteksi untuk GenerateKeyPage */}
              <Route path="/sign" element={<ProtectedRoute><GenerateSignaturePage /></ProtectedRoute>} />
              
              {/* Rute default: jika tidak ditemukan, kembali ke halaman utama */}
              <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;