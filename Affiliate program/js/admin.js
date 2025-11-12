/* =========================================
   FILE: client/js/admin.js
   DESKRIPSI: Script untuk admin.html (SEKARANG TERHUBUNG KE API)
   ========================================= */

// Alamat Back-end API kita
const API_URL = 'http://localhost:5000/api';

document.addEventListener('DOMContentLoaded', function () {

  // --- 1. Ambil & Cek "Tiket" (Token) ---
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Anda harus login untuk mengakses halaman ini.');
    window.location.href = 'login.html';
    return;
  }
  
  // Buat header "Tiket" yang akan kita pakai di setiap request
  const authHeader = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  // --- 2. LOGIKA NAVIGASI TAB (SAMA SEPERTI LAMA) ---
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetTabId = button.getAttribute('data-tab');
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      button.classList.add('active');
      document.getElementById(targetTabId).classList.add('active');
    });
  });

  // --- 3. LOGIKA MODAL (SAMA SEPERTI LAMA) ---
  const editUserModal = document.getElementById('edit-user-modal');
  const productModal = document.getElementById('product-modal');
  const productModalTitle = document.getElementById('product-modal-title');
  const showProductModalBtn = document.getElementById('show-product-modal-btn');
  const editUserButtons = document.querySelectorAll('.btn-edit-user');
  const editProductButtons = document.querySelectorAll('.btn-edit-product');
  const closeModalButtons = document.querySelectorAll('.modal-close-btn');

  function openModal(modalElement) {
    if (modalElement) modalElement.classList.add('show-modal');
  }
  function closeModal(modalElement) {
    if (modalElement) modalElement.classList.remove('show-modal');
  }

  // --- 4. PASANG EVENT LISTENER (LOGIKA LAMA) ---
  
  // Tampilkan modal "Tambah Produk Baru"
  if (showProductModalBtn) {
    showProductModalBtn.addEventListener('click', () => {
      productModalTitle.textContent = 'Tambah Produk Baru';
      document.getElementById('product-form').reset();
      openModal(productModal);
    });
  }

  // Tampilkan modal "Edit Produk" (masih pakai data dummy untuk mengisi form)
  editProductButtons.forEach(button => {
    button.addEventListener('click', () => {
      productModalTitle.textContent = 'Edit Produk';
      // TODO: Isi form dengan data asli
      // Untuk prototipe, kita anggap ID-nya '12345'
      button.closest('tr').setAttribute('data-product-id', '12345'); // Simpan ID
      document.getElementById('product-name').value = 'Contoh Produk Edit';
      document.getElementById('product-price').value = 'Rp 1.000.000';
      document.getElementById('product-commission').value = 20;
      document.getElementById('product-min-level').value = 'Legend';
      openModal(productModal);
    });
  });

  // Tampilkan modal "Edit User" (masih pakai data dummy untuk mengisi form)
  editUserButtons.forEach(button => {
    button.addEventListener('click', () => {
      // TODO: Isi form dengan data asli
      // Untuk prototipe, kita anggap ID-nya '67890'
      button.closest('tr').setAttribute('data-user-id', '67890'); // Simpan ID
      document.getElementById('edit-user-username').value = 'Budi H.';
      document.getElementById('edit-user-email').value = 'budi@gmail.com';
      document.getElementById('edit-user-level').value = 'Master';
      openModal(editUserModal);
    });
  });

  // Logika Menutup Modal (Sama seperti lama)
  closeModalButtons.forEach(button => {
    button.addEventListener('click', () => {
      const modalToClose = button.closest('.modal-overlay');
      closeModal(modalToClose);
    });
  });
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal);
    });
  });

  // --- 5. LOGIKA FORM SUBMIT BARU (TERHUBUNG KE API) ---

  // Form: Tambah / Edit Produk
  document.getElementById('product-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const isEditMode = (productModalTitle.textContent === 'Edit Produk');
    
    // Ambil data dari form
    const productData = {
      namaProduk: document.getElementById('product-name').value,
      harga: document.getElementById('product-price').value,
      linkAffiliate: document.getElementById('product-link').value,
      urlGambar: document.getElementById('product-image-url').value,
      komisiStandar: document.getElementById('product-commission').value,
      levelMinimum: document.getElementById('product-min-level').value
    };

    try {
      let response;
      if (isEditMode) {
        // --- LOGIKA EDIT (PUT) ---
        const productId = '12345'; // Ambil ID dari data-attribute
        response = await fetch(`${API_URL}/admin/products/${productId}`, {
          method: 'PUT',
          headers: authHeader,
          body: JSON.stringify(productData)
        });
      } else {
        // --- LOGIKA TAMBAH (POST) ---
        response = await fetch(`${API_URL}/admin/products`, {
          method: 'POST',
          headers: authHeader,
          body: JSON.stringify(productData)
        });
      }

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Gagal menyimpan produk');
      }

      alert('Produk berhasil disimpan!');
      closeModal(productModal);
      // TODO: Idealnya, kita 'refresh' tabel produk di sini

    } catch (err) {
      alert(err.message);
    }
  });

  // Form: Edit User
  document.getElementById('edit-user-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const userId = '67890'; // Ambil ID dari data-attribute

    // Ambil data dari form
    const userData = {
      username: document.getElementById('edit-user-username').value,
      email: document.getElementById('edit-user-email').value,
      noHp: document.getElementById('edit-user-hp').value,
      level: document.getElementById('edit-user-level').value,
      komisi: document.getElementById('edit-user-commission-balance').value,
      komisiKhusus: document.getElementById('edit-user-custom-commission').value
    };

    try {
      const response = await fetch(`${API_URL}/admin/users/${userId}`, {
        method: 'PUT',
        headers: authHeader,
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Gagal mengupdate user');
      }
      
      alert('User berhasil diupdate!');
      closeModal(editUserModal);
      // TODO: Idealnya, kita 'refresh' tabel user di sini

    } catch (err) {
      alert(err.message);
    }
  });

  // Form: Pengaturan Global
  document.getElementById('settings-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    // Ambil data dari semua form pengaturan
    const settingsData = {
      bankName: document.getElementById('set-bank-name').value,
      bankAccount: document.getElementById('set-bank-account').value,
      // ... ambil semua data harga ...
      contactLink: document.getElementById('set-contact-link').value,
      isWithdrawalBlocked: document.getElementById('set-withdraw-block').checked
    };

    try {
      const response = await fetch(`${API_URL}/admin/settings`, {
        method: 'POST', // Kita pakai POST untuk save semua
        headers: authHeader,
        body: JSON.stringify(settingsData)
      });
      
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Gagal menyimpan pengaturan');
      }
      
      alert('Pengaturan global berhasil disimpan!');

    } catch (err) {
      alert(err.message);
    }
  });

});