import React, { createContext, useState, useEffect, useContext } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';

// 1. Membuat Context
const AuthContext = createContext();

// 2. Membuat Hook custom untuk mempermudah penggunaan context
export const useAuth = () => {
    return useContext(AuthContext);
};

// 3. Membuat Provider
export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [idToken, setIdToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Listener ini akan terpanggil setiap kali status login berubah
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            if (user) {
                // Jika user login, ambil ID Token-nya
                const token = await user.getIdToken();
                setIdToken(token);
            } else {
                setIdToken(null);
            }
            setLoading(false);
        });

        // Cleanup listener saat komponen tidak lagi digunakan
        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        idToken,
        loading
    };

    // Tampilkan children hanya setelah selesai loading
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};