/* =========================================
   FILE: js/auth.js
   DESKRIPSI: Script untuk login.html (Toggle Form & Modal)
   ========================================= */

// Kita jalankan semua kode setelah halaman HTML selesai dimuat
document.addEventListener('DOMContentLoaded', function () {

  // --- Ambil semua elemen yang kita butuhkan ---
  
  // Form
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');

  // Link Toggler
  const showRegisterLink = document.getElementById('show-register-form');
  const showLoginLink = document.getElementById('show-login-form');

  // Modal Reset Password
  const resetModal = document.getElementById('reset-password-modal');
  const showResetLink = document.getElementById('show-reset-modal');
  const closeResetBtn = document.getElementById('close-reset-modal');
  const resetForm = document.getElementById('reset-form');

  // --- 1. Logika Toggle Form Login/Register ---

  // Tampilkan Register, Sembunyikan Login
  if (showRegisterLink) {
    showRegisterLink.addEventListener('click', function (e) {
      e.preventDefault(); // Mencegah link berpindah halaman
      loginForm.classList.add('hidden');
      registerForm.classList.remove('hidden');
    });
  }

  // Tampilkan Login, Sembunyikan Register
  if (showLoginLink) {
    showLoginLink.addEventListener('click', function (e) {
      e.preventDefault(); // Mencegah link berpindah halaman
      registerForm.classList.add('hidden');
      loginForm.classList.remove('hidden');
    });
  }

  // --- 2. Logika Modal Reset Password ---

  // Tampilkan Modal
  if (showResetLink) {
    showResetLink.addEventListener('click', function (e) {
      e.preventDefault();
      resetModal.classList.add('show-modal');
    });
  }

  // Sembunyikan Modal (saat klik tombol 'X')
  if (closeResetBtn) {
    closeResetBtn.addEventListener('click', function () {
      resetModal.classList.remove('show-modal');
    });
  }

  // Sembunyikan Modal (jika klik di luar area konten)
  if (resetModal) {
    resetModal.addEventListener('click', function (e) {
      // Cek jika yang diklik adalah area overlay (latar belakang)
      if (e.target === resetModal) {
        resetModal.classList.remove('show-modal');
      }
    });
  }

  // Aksi saat form reset disubmit
  if (resetForm) {
    resetForm.addEventListener('submit', function (e) {
      e.preventDefault();
      // Simulasikan sukses
      alert('Password berhasil direset! Silahkan login dengan password baru Anda.');
      // Sembunyikan modal
      resetModal.classList.remove('show-modal');
    });
  }
  
  // Catatan: Logika login/register yang sebenarnya (dengan username/password)
  // sudah ditangani oleh <form action="dashboard.html"> di HTML.
  // Kita tidak perlu menambahkannya di sini untuk prototipe ini.

});