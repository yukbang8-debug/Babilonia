/* =========================================
   FILE: client/js/auth.js
   DESKRIPSI: Script untuk login.html (SEKARANG TERHUBUNG KE API)
   ========================================= */

// Alamat Back-end API kita
// Nanti, saat 'online', ini akan diganti dengan URL server Anda
const API_URL = 'http://localhost:5000/api';

document.addEventListener('DOMContentLoaded', function () {

  // --- Ambil semua elemen yang kita butuhkan ---
  
  // Kontainer Form
  const loginFormContainer = document.getElementById('login-form-container');
  const registerFormContainer = document.getElementById('register-form-container');

  // Form Sebenarnya
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

  // --- 1. Logika Toggle Form Login/Register (SAMA SEPERTI LAMA) ---

  if (showRegisterLink) {
    showRegisterLink.addEventListener('click', function (e) {
      e.preventDefault();
      loginFormContainer.classList.add('hidden');
      registerFormContainer.classList.remove('hidden');
    });
  }

  if (showLoginLink) {
    showLoginLink.addEventListener('click', function (e) {
      e.preventDefault();
      registerFormContainer.classList.add('hidden');
      loginFormContainer.classList.remove('hidden');
    });
  }

  // --- 2. Logika Modal Reset Password (SAMA SEPERTI LAMA) ---
  // (Logika reset di back-end belum kita buat, jadi ini masih simulasi)
  
  if (showResetLink) {
    showResetLink.addEventListener('click', (e) => {
      e.preventDefault();
      resetModal.classList.add('show-modal');
    });
  }
  if (closeResetBtn) {
    closeResetBtn.addEventListener('click', () => resetModal.classList.remove('show-modal'));
  }
  if (resetModal) {
    resetModal.addEventListener('click', (e) => {
      if (e.target === resetModal) resetModal.classList.remove('show-modal');
    });
  }
  if (resetForm) {
    resetForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Fitur reset password belum terhubung ke back-end.');
      resetModal.classList.remove('show-modal');
    });
  }
  
  // --- 3. LOGIKA BARU: Form Register Submit (Terhubung ke API) ---
  
  if (registerForm) {
    registerForm.addEventListener('submit', async function (e) {
      e.preventDefault(); // HENTIKAN submit HTML default

      // Ambil data dari form
      const username = document.getElementById('reg-username').value;
      const email = document.getElementById('reg-email').value;
      const noHp = document.getElementById('reg-hp').value;
      const password = document.getElementById('reg-password').value;
      const confirmPassword = document.getElementById('reg-confirm-password').value;

      // Validasi Front-end
      if (password !== confirmPassword) {
        alert('Password dan Konfirmasi Password tidak cocok!');
        return;
      }
      
      // Kirim data ke Back-end
      try {
        const res = await fetch(`${API_URL}/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, email, password, noHp }),
        });

        const data = await res.json();

        if (!res.ok) {
          // Jika server mengembalikan error (cth: 400 - Email sudah ada)
          throw new Error(data.message || 'Terjadi kesalahan saat mendaftar');
        }

        // --- SUKSES ---
        alert('Registrasi berhasil! Anda akan dialihkan ke Dashboard.');
        
        // Simpan "Tiket" (Token) di memori browser (localStorage)
        localStorage.setItem('token', data.token);
        
        // Arahkan ke dashboard
        window.location.href = 'dashboard.html';

      } catch (err) {
        alert(err.message); // Tampilkan pesan error dari server
      }
    });
  }

  // --- 4. LOGIKA BARU: Form Login Submit (Terhubung ke API) ---
  
  if (loginForm) {
    loginForm.addEventListener('submit', async function (e) {
      e.preventDefault(); // HENTIKAN submit HTML default

      // Ambil data
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;

      try {
        const res = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          // Jika server mengembalikan error (cth: 400 - Password salah)
          throw new Error(data.message || 'Terjadi kesalahan saat login');
        }

        // --- SUKSES ---
        // Simpan "Tiket" (Token) di memori browser
        localStorage.setItem('token', data.token);
        
        // Arahkan ke dashboard
        window.location.href = 'dashboard.html';

      } catch (err) {
        alert(err.message); // Tampilkan pesan error
      }
    });
  }

});