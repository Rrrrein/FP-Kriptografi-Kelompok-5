import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Ganti dengan konfigurasi Firebase dari project Anda
const firebaseConfig = {
    apiKey: "AIza...",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "...",
    appId: "1:..."
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);