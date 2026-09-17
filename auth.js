const authModal = document.getElementById("auth-modal");
const authLoggedOut = document.getElementById("auth-logged-out");
const authLoggedIn = document.getElementById("auth-logged-in");
const authTabLogin = document.getElementById("auth-tab-login");
const authTabRegister = document.getElementById("auth-tab-register");
const authTitle = document.getElementById("auth-title");
const authSubtitle = document.getElementById("auth-subtitle");
const authNameField = document.getElementById("auth-name-field");
const authError = document.getElementById("auth-error");
const authSubmitBtn = document.getElementById("auth-submit-btn");
const authForgotBtn = document.getElementById("auth-forgot-btn");
const authCurrentEmail = document.getElementById("auth-current-email");
const accountBtnLabel = document.getElementById("account-btn-label");

let authMode = "login";
let pendingCheckoutAfterLogin = false;

function showAuthError(message) {
  authError.textContent = message;
  authError.classList.remove("hidden");
}

function clearAuthError() {
  authError.classList.add("hidden");
  authError.textContent = "";
}

function switchAuthTab(mode) {
  authMode = mode;
  clearAuthError();
  const isLogin = mode === "login";
  authTabLogin.classList.toggle("bg-white", isLogin);
  authTabLogin.classList.toggle("shadow-sm", isLogin);
  authTabLogin.classList.toggle("text-slate-900", isLogin);
  authTabLogin.classList.toggle("text-slate-400", !isLogin);
  authTabRegister.classList.toggle("bg-white", !isLogin);
  authTabRegister.classList.toggle("shadow-sm", !isLogin);
  authTabRegister.classList.toggle("text-slate-900", !isLogin);
  authTabRegister.classList.toggle("text-slate-400", isLogin);
  authNameField.classList.toggle("hidden", isLogin);
  authTitle.textContent = isLogin ? "Masuk ke Akun Anda" : "Buat Akun Baru";
  authSubtitle.textContent = isLogin
    ? "Gunakan email untuk masuk dan checkout lebih cepat"
    : "Daftar dengan email untuk mulai belanja";
  authSubmitBtn.textContent = isLogin ? "Masuk" : "Daftar";
  authForgotBtn.classList.toggle("hidden", !isLogin);
}

function openAuthModal(afterCheckout) {
  pendingCheckoutAfterLogin = Boolean(afterCheckout);
  clearAuthError();
  authModal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
  if (firebase.auth().currentUser) {
    authLoggedOut.classList.add("hidden");
    authLoggedIn.classList.remove("hidden");
    authCurrentEmail.textContent = firebase.auth().currentUser.email;
  } else {
    authLoggedOut.classList.remove("hidden");
    authLoggedIn.classList.add("hidden");
    switchAuthTab("login");
  }
}

function closeAuthModal() {
  authModal.classList.add("hidden");
  document.body.style.overflow = "";
}

function friendlyAuthError(code) {
  const map = {
    "auth/email-already-in-use": "Email ini sudah terdaftar. Silakan masuk.",
    "auth/invalid-email": "Format email tidak valid.",
    "auth/weak-password": "Password minimal 6 karakter.",
    "auth/user-not-found": "Email belum terdaftar. Silakan daftar dulu.",
    "auth/wrong-password": "Password salah.",
    "auth/invalid-credential": "Email atau password salah.",
    "auth/api-key-not-valid.-please-pass-a-valid-api-key.": "Firebase belum dikonfigurasi oleh pemilik toko. Lihat firebase-config.js.",
    "auth/configuration-not-found": "Login Email/Password belum diaktifkan di Firebase Console.",
  };
  return map[code] || "Terjadi kesalahan. Silakan coba lagi.";
}

async function handleAuthSubmit(event) {
  event.preventDefault();
  clearAuthError();
  const email = document.getElementById("auth-email").value.trim();
  const password = document.getElementById("auth-password").value;
  authSubmitBtn.disabled = true;
  try {
    if (authMode === "register") {
      const name = document.getElementById("auth-name").value.trim();
      const credential = await firebase.auth().createUserWithEmailAndPassword(email, password);
      if (name) await credential.user.updateProfile({ displayName: name });
    } else {
      await firebase.auth().signInWithEmailAndPassword(email, password);
    }
    closeAuthModal();
    if (pendingCheckoutAfterLogin) {
      pendingCheckoutAfterLogin = false;
      startCheckout();
    }
  } catch (error) {
    showAuthError(friendlyAuthError(error.code));
  } finally {
    authSubmitBtn.disabled = false;
  }
  return false;
}

async function handleForgotPassword() {
  clearAuthError();
  const email = document.getElementById("auth-email").value.trim();
  if (!email) {
    showAuthError('Masukkan email Anda terlebih dahulu, lalu klik "Lupa password" lagi.');
    return;
  }
  try {
    await firebase.auth().sendPasswordResetEmail(email);
    showAuthError("Link reset password telah dikirim ke email Anda.");
  } catch (error) {
    showAuthError(friendlyAuthError(error.code));
  }
}

function handleLogout() {
  firebase.auth().signOut();
  closeAuthModal();
}

firebase.auth().onAuthStateChanged((user) => {
  accountBtnLabel.textContent = user ? (user.displayName || user.email.split("@")[0]) : "Masuk";
});

authModal.addEventListener("click", (event) => {
  if (event.target === authModal) closeAuthModal();
});
