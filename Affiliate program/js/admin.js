/* =========================================
   FILE: js/admin.js
   DESKRIPSI: Script untuk admin.html (Navigasi Tab & Modal)
   ========================================= */

document.addEventListener('DOMContentLoaded', function () {

  // --- 1. LOGIKA NAVIGASI TAB ---

  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetTabId = button.getAttribute('data-tab');

      // Hapus 'active' dari semua tombol dan konten
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));

      // Tambahkan 'active' ke tombol yang diklik dan konten yang sesuai
      button.classList.add('active');
      document.getElementById(targetTabId).classList.add('active');
    });
  });

  // --- 2. LOGIKA MODAL (POPUP) ---

  // Ambil semua elemen modal
  const editUserModal = document.getElementById('edit-user-modal');
  const productModal = document.getElementById('product-modal');
  const productModalTitle = document.getElementById('product-modal-title');
  const productForm = document.getElementById('product-form');

  // Ambil semua tombol yang MEMBUKA modal
  const showProductModalBtn = document.getElementById('show-product-modal-btn');
  const editUserButtons = document.querySelectorAll('.btn-edit-user');
  const editProductButtons = document.querySelectorAll('.btn-edit-product');

  // Ambil semua tombol yang MENUTUP modal
  const closeModalButtons = document.querySelectorAll('.modal-close-btn');

  // Fungsi generik untuk membuka modal
  function openModal(modalElement) {
    if (modalElement) {
      modalElement.classList.add('show-modal');
    }
  }

  // Fungsi generik untuk menutup modal
  function closeModal(modalElement) {
    if (modalElement) {
      modalElement.classList.remove('show-modal');
    }
  }

  // --- 3. PASANG EVENT LISTENER ---

  // Tampilkan modal "Tambah Produk Baru"
  if (showProductModalBtn) {
    showProductModalBtn.addEventListener('click', () => {
      // Atur judul dan reset form untuk mode "Tambah Baru"
      productModalTitle.textContent = 'Tambah Produk Baru';
      productForm.reset(); // Kosongkan form
      openModal(productModal);
    });
  }

  // Tampilkan modal "Edit Produk" (untuk semua tombol edit di tabel produk)
  editProductButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Atur judul untuk mode "Edit"
      productModalTitle.textContent = 'Edit Produk';
      
      // Di aplikasi nyata, kita akan mengambil data produk dan mengisinya ke form.
      // Untuk prototipe, kita isi data dummy:
      document.getElementById('product-name').value = 'Contoh Produk Yang Diedit';
      document.getElementById('product-price').value = 'Rp 1.000.000';
      document.getElementById('product-commission').value = 20;
      document.getElementById('product-min-level').value = 'Legend';
      
      openModal(productModal);
    });
  });

  // Tampilkan modal "Edit User" (untuk semua tombol edit di tabel user)
  editUserButtons.forEach(button => {
    button.addEventListener('click', () => {
      
      // Di aplikasi nyata, kita akan mengambil data user dan mengisinya ke form.
      // Untuk prototipe, kita isi data dummy:
      document.getElementById('edit-user-username').value = 'Budi H.';
      document.getElementById('edit-user-email').value = 'budi@gmail.com';
      document.getElementById('edit-user-hp').value = '08123456789';
      document.getElementById('edit-user-commission-balance').value = 1250000;
      document.getElementById('edit-user-level').value = 'Master';
      document.getElementById('edit-user-custom-commission').value = ''; // Kosong
      
      openModal(editUserModal);
    });
  });


  // --- 4. LOGIKA MENUTUP MODAL ---

  // Tambahkan listener untuk semua tombol 'X'
  closeModalButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Temukan modal parent terdekat dan tutup
      const modalToClose = button.closest('.modal-overlay');
      closeModal(modalToClose);
    });
  });

  // Tutup modal jika klik di luar area konten (overlay)
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) { // Cek jika yang diklik adalah overlay-nya
        closeModal(modal);
      }
    });
  });

  // --- 5. LOGIKA FORM SUBMIT (Simulasi) ---
  
  // Simulasikan submit form (agar tidak refresh halaman)
  document.getElementById('edit-user-form').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Data user (simulasi) berhasil disimpan!');
    closeModal(editUserModal);
  });
  
  document.getElementById('product-form').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Data produk (simulasi) berhasil disimpan!');
    closeModal(productModal);
  });
  
  document.getElementById('settings-form').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Pengaturan (simulasi) berhasil disimpan!');
    // Tidak perlu tutup modal karena ini bukan modal
  });

});