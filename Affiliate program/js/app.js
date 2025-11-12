/* =========================================
   FILE: client/js/app.js
   DESKRIPSI: Script untuk dashboard.html (SEKARANG TERHUBUNG KE API)
   ========================================= */

// Alamat Back-end API kita
const API_URL = 'http://localhost:5000/api';

// --- 1. SIMULASI & DATA DUMMY (YANG MASIH DIPERLUKAN) ---

// TODO: Nanti, nilai ini akan diambil dari API /api/admin/settings
// Untuk sekarang, kita biarkan di 'true' untuk testing notif upgrade.
let isWithdrawalBlocked = true;

// --- 2. LOGIKA UTAMA SAAT HALAMAN DIMUAT ---
document.addEventListener('DOMContentLoaded', function () {
  
  // Ambil "Tiket" (Token) dari memori browser
  const token = localStorage.getItem('token');

  // --- 2a. Pengecekan Keamanan (WAJIB) ---
  if (!token) {
    // Jika tidak ada tiket, tendang user kembali ke halaman login
    alert('Anda harus login terlebih dahulu.');
    window.location.href = 'login.html';
    return; // Hentikan eksekusi kode
  }

  // --- 2b. Jika Tiket Ada, Lanjutkan ---
  
  // Jalankan ticker notifikasi (ini murni visual, tidak perlu API)
  startNotificationTicker();
  
  // Ambil data produk "nyata" dari server
  fetchProducts(token);
  
  // Siapkan tombol-tombol modal (withdraw)
  setupWithdrawalModals();
});


// --- 3. FUNGSI BARU: Mengambil Produk dari API ---
async function fetchProducts(token) {
  const productListContainer = document.getElementById('product-list-container');
  if (!productListContainer) return;

  try {
    // Panggil "pintu" /api/products, KIRIMKAN "Tiket" di Header
    const response = await fetch(`${API_URL}/products`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Ini "Tiket" Anda
      }
    });

    if (!response.ok) {
      // Jika server membalas error (cth: 401 - Tiket tidak valid)
      if (response.status === 401) {
        // Tiket salah atau kadaluarsa
        alert('Sesi Anda telah berakhir. Silahkan login kembali.');
        localStorage.removeItem('token'); // Hapus tiket palsu
        window.location.href = 'login.html'; // Tendang ke login
      }
      throw new Error('Gagal mengambil data produk');
    }

    const products = await response.json();
    
    // Kirim data "nyata" dari server untuk ditampilkan
    renderProducts(products);

  } catch (err) {
    console.error(err);
    productListContainer.innerHTML = '<p class="text-center" style="color: var(--danger-color);">Gagal memuat produk. Coba refresh.</p>';
  }
}

// --- 4. FUNGSI UPDATE: Menampilkan Produk ---
// (Fungsi ini sekarang LEBIH SEDERHANA)
function renderProducts(products) {
  const productListContainer = document.getElementById('product-list-container');
  
  // Kosongkan kontainer (menghapus template HTML)
  productListContainer.innerHTML = '';
  
  if (products.length === 0) {
      productListContainer.innerHTML = '<p class="text-center">Belum ada produk yang tersedia.</p>';
      return;
  }

  // Loop melalui setiap produk dari API
  products.forEach(product => {
    
    // BUAT KARTU (CARD)
    const productCard = document.createElement('div');
    productCard.classList.add('product-card');
    
    // Tambahkan class 'locked' jika data dari API bilang 'isLocked: true'
    if (product.isLocked) {
      productCard.classList.add('locked');
    }
    
    // Buat HTML di dalam kartu
    let cardHTML = `
      <img src="${product.urlGambar}" alt="${product.namaProduk}" class="product-image">
      <div class="product-info">
        <h5>${product.namaProduk}</h5>
        <div class="price">${product.harga}</div>
        <div class="commission">Komisi: ${product.komisi}%</div>
    `;
    
    // Tambahkan tombol berdasarkan status 'isLocked'
    if (product.isLocked) {
      cardHTML += `
        <div class="lock-overlay">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64h16z"/></svg>
          Upgrade ke ${product.levelMinimum}
        </div>
      `;
    } else {
      cardHTML += `
        <button class="btn btn-secondary btn-small btn-copy" data-link="${product.linkAffiliate}">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="14" height="14" fill="currentColor" style="display: inline-block; vertical-align: middle; margin-right: 5px;"><path d="M384 336H192c-8.8 0-16-7.2-16-16V16c0-8.8 7.2-16 16-16h192c8.8 0 16 7.2 16 16v304c0 8.8-7.2 16-16 16zM208 384c-35.3 0-64 28.7-64 64V464c0 8.8 7.2 16 16 16h192c8.8 0 16-7.2 16-16v-16c0-35.3-28.7-64-64-64H208zM160 96H64c-8.8 0-16 7.2-16 16v304c0 8.8 7.2 16 16 16h192c8.8 0 16-7.2 16-16v-16c0-35.3-28.7-64-64-64H160V96z"/></svg>
          Copy Link
        </button>
      `;
    }
    
    cardHTML += `</div>`; // Tutup .product-info
    productCard.innerHTML = cardHTML;
    
    // Tambahkan kartu ke kontainer
    productListContainer.appendChild(productCard);
  });
  
  // Setelah semua produk di-render, tambahkan listener ke tombol 'Copy Link'
  addCopyLinkListeners();
}

// --- 5. FUNGSI HELPER (TIDAK BERUBAH) ---

// Fungsi untuk tombol 'Copy Link' (Sama seperti lama)
function addCopyLinkListeners() {
  document.querySelectorAll('.btn-copy').forEach(button => {
    button.addEventListener('click', function() {
      const linkToCopy = this.getAttribute('data-link');
      
      // Coba copy ke clipboard
      navigator.clipboard.writeText(linkToCopy).then(() => {
        // Sukses
        this.innerHTML = 'Disalin!';
      }, () => {
        // Gagal (mungkin di browser lama/http)
        alert('Gagal menyalin. Salin manual: ' + linkToCopy);
      });
      
      // Kembalikan teks tombol
      setTimeout(() => {
        this.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="14" height="14" fill="currentColor" style="display: inline-block; vertical-align: middle; margin-right: 5px;"><path d="M384 336H192c-8.8 0-16-7.2-16-16V16c0-8.8 7.2-16 16-16h192c8.8 0 16 7.2 16 16v304c0 8.8-7.2 16-16 16zM208 384c-35.3 0-64 28.7-64 64V464c0 8.8 7.2 16 16 16h192c8.8 0 16-7.2 16-16v-16c0-35.3-28.7-64-64-64H208zM160 96H64c-8.8 0-16 7.2-16 16v304c0 8.8 7.2 16 16 16h192c8.8 0 16-7.2 16-16v-16c0-35.3-28.7-64-64-64H160V96z"/></svg> Copy Link`;
      }, 2000);
    });
  });
}

// Logika Notifikasi Penarikan (Ticker) (Sama seperti lama)
function startNotificationTicker() {
  const tickerItemsContainer = document.getElementById('ticker-items');
  if (!tickerItemsContainer) return;
  
  const levels = [
    { name: "Master", class: "level-master" },
    { name: "Grandmaster", class: "level-grandmaster" },
    { name: "Epic", class: "level-epic" },
    { name: "Legend", class: "level-legend" },
    { name: "Mytic", class: "level-mytic" }
  ];

  function createTickerItem() {
    const level = levels[Math.floor(Math.random() * levels.length)];
    const code = Math.random().toString().substr(2, 10).replace(/(\d{4})(\d{6})/, '$1*****');
    const amount = (Math.random() * (50000000 - 5000000) + 5000000).toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 });
    const item = document.createElement('div');
    item.classList.add('ticker-item');
    item.innerHTML = `<span>${code}</span> <span class="${level.class}">${level.name}</span> <span class="amount">${amount}</span>`;
    return item;
  }
  for (let i = 0; i < 10; i++) tickerItemsContainer.appendChild(createTickerItem());
  
  // (Animasi scroll tidak saya sertakan di sini agar kode lebih ringkas,
  // tapi logika dari file prototipe lama bisa di-copy-paste ke sini)
}

// Logika Modal Withdraw (Sama seperti lama, masih pakai var palsu)
function setupWithdrawalModals() {
  const showWithdrawBtn = document.getElementById('show-withdraw-modal-btn');
  const withdrawFormModal = document.getElementById('withdraw-form-modal');
  const closeWithdrawFormBtn = document.getElementById('close-withdraw-form-modal');
  const withdrawForm = document.getElementById('withdraw-form');
  const notifyModal = document.getElementById('withdraw-notify-modal');
  const notifyModalTitle = document.getElementById('notify-modal-title');
  const notifyModalMessage = document.getElementById('notify-modal-message');
  const closeNotifyBtn = document.getElementById('close-notify-modal');
  const closeNotifyBtnMain = document.getElementById('close-notify-modal-btn');

  if(showWithdrawBtn) showWithdrawBtn.addEventListener('click', () => withdrawFormModal.classList.add('show-modal'));
  if(closeWithdrawFormBtn) closeWithdrawFormBtn.addEventListener('click', () => withdrawFormModal.classList.remove('show-modal'));
  
  if(withdrawForm) {
    withdrawForm.addEventListener('submit', (e) => {
      e.preventDefault();
      withdrawFormModal.classList.remove('show-modal');
      
      // Masih pakai variabel palsu
      if (isWithdrawalBlocked) {
        notifyModalTitle.textContent = 'Penarikan Gagal';
        notifyModalMessage.textContent = 'Silahkan upgrade membership untuk melanjutkan withdraw.';
      } else {
        notifyModalTitle.textContent = 'Penarikan Sukses';
        notifyModalMessage.textContent = 'Permintaan penarikan Anda telah dikirim dan sedang diproses.';
      }
      notifyModal.classList.add('show-modal');
      withdrawForm.reset();
    });
  }

  if(closeNotifyBtn) closeNotifyBtn.addEventListener('click', () => notifyModal.classList.remove('show-modal'));
  if(closeNotifyBtnMain) closeNotifyBtnMain.addEventListener('click', () => notifyModal.classList.remove('show-modal'));
  
  [withdrawFormModal, notifyModal].forEach(modal => {
    if(modal) modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('show-modal');
    });
  });
}