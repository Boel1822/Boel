// ============================================================
// FIREBASE SETUP
// ------------------------------------------------------------
// Project: nalvost-beauty
// PENTING: pastikan Authentication > Sign-in method > "Email/Password"
// sudah diaktifkan di Firebase Console, dan domain tempat situs ini
// di-hosting sudah ditambahkan di Authentication > Settings >
// Authorized domains (localhost & *.firebaseapp.com sudah otomatis
// diizinkan secara default).
// ============================================================
const firebaseConfig = {
  apiKey: "AIzaSyCHue0zH7m-f82XmBOkYdundAFloa9EkUM",
  authDomain: "nalvost-beauty.firebaseapp.com",
  projectId: "nalvost-beauty",
  storageBucket: "nalvost-beauty.firebasestorage.app",
  messagingSenderId: "1039105281308",
  appId: "1:1039105281308:web:a3626147dfa628fe08bed9",
  measurementId: "G-RDZ9RWNKPC",
};

firebase.initializeApp(firebaseConfig);
