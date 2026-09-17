// ============================================================
// FIREBASE SETUP (wajib diisi agar tombol Masuk/Daftar berfungsi)
// ------------------------------------------------------------
// 1. Buka https://console.firebase.google.com/ dan buat project baru (gratis).
// 2. Di Project Settings > General > "Your apps", klik "Add app" > pilih Web (</>).
// 3. Salin object firebaseConfig yang diberikan Firebase, lalu tempel di bawah ini.
// 4. Buka menu Authentication > Sign-in method > aktifkan provider "Email/Password".
// Tanpa langkah ini, tombol Masuk/Daftar akan menampilkan pesan error.
// ============================================================
const firebaseConfig = {
  apiKey: "GANTI_DENGAN_API_KEY_ANDA",
  authDomain: "GANTI_DENGAN_PROJECT_ANDA.firebaseapp.com",
  projectId: "GANTI_DENGAN_PROJECT_ID_ANDA",
  storageBucket: "GANTI_DENGAN_PROJECT_ANDA.appspot.com",
  messagingSenderId: "GANTI_DENGAN_SENDER_ID_ANDA",
  appId: "GANTI_DENGAN_APP_ID_ANDA",
};

if (firebaseConfig.apiKey.startsWith("GANTI_DENGAN")) {
  console.warn("[Nalvost Beauty] Firebase belum dikonfigurasi. Lihat firebase-config.js untuk instruksi setup.");
}

firebase.initializeApp(firebaseConfig);
