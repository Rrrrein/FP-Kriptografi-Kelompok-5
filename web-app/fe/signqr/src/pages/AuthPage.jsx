import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FiLogIn, FiUserPlus } from 'react-icons/fi';

const API_URL = 'http://localhost:5000';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        const toastId = toast.loading('Mendaftarkan akun...');
        try {
            await axios.post(`${API_URL}/register`, { email, password });
            toast.success('Registrasi berhasil! Silakan login.', { id: toastId });
            setIsLogin(true);
        } catch (err) {
            const msg = err.response?.data?.details || 'Gagal mendaftar.';
            toast.error(msg, { id: toastId });
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const toastId = toast.loading('Proses login...');
        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast.success('Login berhasil!', { id: toastId });
            navigate('/');
        } catch (err) {
            toast.error('Email atau password salah.', { id: toastId });
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md rounded-2xl border border-border-color bg-card-bg p-8 shadow-2xl backdrop-blur-lg">
                <h1 className="mb-6 text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-3xl font-bold text-transparent">
                    {isLogin ? 'Welcome Back' : 'Create Your Account'}
                </h1>
                <form onSubmit={isLogin ? handleLogin : handleRegister} className="flex flex-col gap-4">
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required className="w-full rounded-lg border border-border-color bg-dark-bg p-3 text-sm text-text-light focus:border-primary focus:ring-2 focus:ring-primary" />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required className="w-full rounded-lg border border-border-color bg-dark-bg p-3 text-sm text-text-light focus:border-primary focus:ring-2 focus:ring-primary" />
                    <button type="submit" className="group flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:scale-105">
                        {isLogin ? <FiLogIn/> : <FiUserPlus />}
                        {isLogin ? 'Login' : 'Register'}
                    </button>
                </form>
                <div className="mt-6 text-center">
                    <button onClick={() => setIsLogin(!isLogin)} className="text-sm text-text-muted hover:text-primary">
                        {isLogin ? 'Belum punya akun? Buat Akun' : 'Sudah punya akun? Login'}
                    </button>
                </div>
            </div>
        </div>
    );
}