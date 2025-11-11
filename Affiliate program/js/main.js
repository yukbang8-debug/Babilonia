/* =========================================
   FILE: js/main.js
   DESKRIPSI: Script Global (Tombol Admin & Kontak)
   ========================================= */

// Kita jalankan semua kode setelah halaman HTML selesai dimuat
document.addEventListener('DOMContentLoaded', function () {

  // --- 1. Logika Tombol Hubungi Admin (WA/Tele) ---
  
  const contactAdminBtn = document.getElementById('contact-admin-btn');
  
  if (contactAdminBtn) {
    contactAdminBtn.addEventListener('click', function () {
      
      // CATATAN: 
      // Nanti, link ini akan diambil dari database/admin panel.
      // Untuk prototipe, kita gunakan link WhatsApp dummy.
      const adminContactLink = 'https://wa.me/6281234567890'; // Ganti dengan nomor WA Anda
      
      // Buka link di tab baru
      window.open(adminContactLink, '_blank');
    });
  }

  // --- 2. Logika Tombol Akses Admin (Gear) ---
  
  const adminAccessBtn = document.getElementById('admin-access-btn');
  
  if (adminAccessBtn) {
    adminAccessBtn.addEventListener('click', function () {
      
      // Munculkan popup prompt bawaan browser
      const accessCode = prompt('Masukkan Kode Akses Admin:');
      
      // Cek apakah user menekan "OK" dan kodenya benar
      if (accessCode === '521389') {
        // Jika benar, arahkan ke halaman admin
        alert('Akses Diberikan. Memuat Panel Admin...');
        window.location.href = 'admin.html';
      } 
      // Cek jika user menekan "OK" tapi kodenya salah
      else if (accessCode !== null && accessCode !== '') {
        // Jika salah (dan tidak dibatalkan)
        alert('Kode Salah. Akses Ditolak.');
      }
      // Jika user menekan "Cancel" (accessCode === null), tidak terjadi apa-apa
      
    });
  }

});