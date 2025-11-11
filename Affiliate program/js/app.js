/* =========================================
   FILE: js/app.js
   DESKRIPSI: Script untuk dashboard.html (Otak Aplikasi)
   ========================================= */

// Kita jalankan semua kode setelah halaman HTML selesai dimuat
document.addEventListener('DOMContentLoaded', function () {

  // --- 1. SIMULASI DATABASE & USER ---
  // Di aplikasi nyata, data ini akan datang dari server/database.
  // Di prototipe, kita buat di sini.

  /**
   * SIMULASI USER YANG SEDANG LOGIN
   * Ubah 'level' di sini untuk menguji logika kunci produk.
   * Coba ganti ke: "Warrior", "Master", "Legend", "Mytic".
   * 'customCommission':
   * null = pakai komisi produk.
   * angka (misal: 25) = override komisi produk, jadi 25%.
   */
  const currentUser = {
    name: "Boy",
    level: "Master", // UBAH INI UNTUK TES (Warrior, Master, Grandmaster, Epic, Legend, Mytic)
    customCommission: null // UBAH INI UNTUK TES (misal: 25)
  };

  /**
   * SIMULASI DATABASE PRODUK
   * 'minLevel' adalah level MINIMUM untuk membuka.
   */
  const databaseProducts = [
    { id: 1, name: "Produk Digital A", price: "Rp 500.000", commission: 10, minLevel: "Warrior", img: "https://via.placeholder.com/100/64FFDA/0A192F?text=PRODUK+1" },
    { id: 2, name: "Ebook Marketing B", price: "Rp 350.000", commission: 12, minLevel: "Warrior", img: "https://via.placeholder.com/100/64FFDA/0A192F?text=PRODUK+2" },
    { id: 3, name: "Template Desain C", price: "Rp 700.000", commission: 15, minLevel: "Master", img: "https://via.placeholder.com/100/5BDEB5/0A192F?text=PRODUK+3" },
    { id: 4, name: "Course Online D", price: "Rp 1.200.000", commission: 15, minLevel: "Master", img: "https://via.placeholder.com/100/5BDEB5/0A192F?text=PRODUK+4" },
    { id: 5, name: "Layanan SEO E", price: "Rp 2.500.000", commission: 20, minLevel: "Grandmaster", img: "https://via.placeholder.com/100/4FA8FF/0A192F?text=PRODUK+5" },
    { id: 6, name: "Tools Analitik F", price: "Rp 3.000.000", commission: 20, minLevel: "Grandmaster", img: "https://via.placeholder.com/100/4FA8FF/0A192F?text=PRODUK+6" },
    { id: 7, name: "Software Agency G", price: "Rp 5.000.000", commission: 25, minLevel: "Epic", img: "https://via.placeholder.com/100/D042F3/0A192F?text=PRODUK+7" },
    { id: 8, name: "Akses Lifetime H", price: "Rp 8.000.000", commission: 30, minLevel: "Legend", img: "https://via.placeholder.com/100/FFD700/0A192F?text=PRODUK+8" },
    { id: 9, name: "Paket Reseller I", price: "Rp 10.000.000", commission: 40, minLevel: "Legend", img: "https://via.placeholder.com/100/FFD700/0A192F?text=PRODUK+9" },
    { id: 10, name: "Program Khusus J", price: "Rp 15.000.000", commission: 50, minLevel: "Mytic", img: "https://via.placeholder.com/100/FF4D4D/0A192F?text=PRODUK+10" }
  ];
  // (Untuk 20 produk, tinggal copy-paste dan ubah datanya)

  /**
   * SIMULASI STATUS ADMIN
   * 'isWithdrawalBlocked = true' -> akan memunculkan notif "Upgrade!"
   * 'isWithdrawalBlocked = false' -> akan memunculkan notif "Sukses"
   */
  let isWithdrawalBlocked = true; // UBAH INI UNTUK TES (true / false)


  // --- 2. LOGIKA TAMPILAN AWAL ---

  // Set nama user di header
  const userNameEl = document.getElementById('user-name');
  if (userNameEl) {
    userNameEl.textContent = currentUser.name;
  }

  // --- 3. LOGIKA NOTIFIKASI PENARIKAN (TICKER) ---

  const tickerItemsContainer = document.getElementById('ticker-items');
  if (tickerItemsContainer) {
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
      // Nominal acak antara 5jt dan 50jt
      const amount = (Math.random() * (50000000 - 5000000) + 5000000).toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 });

      const item = document.createElement('div');
      item.classList.add('ticker-item');
      item.innerHTML = `
        <span>${code}</span> 
        <span class="${level.class}">${level.name}</span> 
        <span class="amount">${amount}</span>
      `;
      return item;
    }

    // Isi 10 item palsu saat pertama kali dimuat
    for (let i = 0; i < 10; i++) {
      tickerItemsContainer.appendChild(createTickerItem());
    }

    // Mulai animasi scroll
    function startTickerAnimation() {
      let position = 0;
      const containerHeight = tickerItemsContainer.parentElement.clientHeight;
      const itemsHeight = tickerItemsContainer.scrollHeight;
      
      // Duplikasi item jika belum cukup tinggi untuk loop
      while (tickerItemsContainer.scrollHeight < containerHeight * 2) {
          tickerItemsContainer.appendChild(createTickerItem());
      }

      function scroll() {
        position -= 0.5; // Kecepatan scroll
        // Jika sudah scroll sejauh setengah (item duplikat)
        if (position < -(itemsHeight / 2)) {
          position = 0; // Reset ke awal
        }
        tickerItemsContainer.style.transform = `translateY(${position}px)`;
        requestAnimationFrame(scroll);
      }
      requestAnimationFrame(scroll);
      
      // Tambah item baru setiap 5-10 detik (opsional)
      setInterval(() => {
          const newItem = createTickerItem();
          tickerItemsContainer.appendChild(newItem); // Tambah di akhir
          tickerItemsContainer.insertBefore(newItem, tickerItemsContainer.firstChild); // Tambah di awal (untuk duplikat)
      }, Math.random() * (10000 - 5000) + 5000);
    }
    
    startTickerAnimation();
  }


  // --- 4. LOGIKA PRODUK (RENDER & KUNCI) ---

  const productListContainer = document.getElementById('product-list-container');
  
  // Hirarki level (untuk perbandingan)
  const levelHierarchy = {
    "Warrior": 1,
    "Master": 2,
    "Grandmaster": 3,
    "Epic": 4,
    "Legend": 5,
    "Mytic": 6
  };
  
  const currentUserLevelValue = levelHierarchy[currentUser.level] || 0;

  function renderProducts() {
    if (!productListContainer) return;
    
    // Kosongkan kontainer (menghapus template HTML)
    productListContainer.innerHTML = ''; 

    // Loop melalui setiap produk di database
    databaseProducts.forEach(product => {
      
      const productLevelValue = levelHierarchy[product.minLevel] || 0;
      
      // Cek apakah produk TERKUNCI
      const isLocked = currentUserLevelValue < productLevelValue;
      
      // Tentukan komisi yang akan ditampilkan
      let displayCommission;
      if (currentUser.customCommission !== null) {
        // Jika ada komisi override, pakai itu
        displayCommission = currentUser.customCommission;
      } else {
        // Jika tidak, pakai komisi standar produk
        displayCommission = product.commission;
      }
      
      // Buat elemen div untuk kartu produk
      const productCard = document.createElement('div');
      productCard.classList.add('product-card');
      if (isLocked) {
        productCard.classList.add('locked');
      }
      
      // Buat HTML di dalam kartu
      let cardHTML = `
        <img src="${product.img}" alt="${product.name}" class="product-image">
        <div class="product-info">
          <h5>${product.name}</h5>
          <div class="price">${product.price}</div>
          <div class="commission">Komisi: ${displayCommission}%</div>
      `;
      
      // Tambahkan tombol berdasarkan status TERKUNCI/TERBUKA
      if (isLocked) {
        cardHTML += `
          <div class="lock-overlay">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64h16z"/></svg>
            Upgrade ke ${product.minLevel}
          </div>
        `;
      } else {
        cardHTML += `
          <button class="btn btn-secondary btn-small btn-copy" data-link="httpsPRODUK_LINK_${product.id}">
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
  
  // Fungsi untuk tombol 'Copy Link'
  function addCopyLinkListeners() {
    document.querySelectorAll('.btn-copy').forEach(button => {
      button.addEventListener('click', function() {
        const linkToCopy = this.getAttribute('data-link');
        
        // Simulasikan copy ke clipboard (karena `navigator.clipboard` butuh HTTPS)
        // navigator.clipboard.writeText(linkToCopy).then(() => { ... });
        
        // Tampilkan notifikasi palsu
        alert(`Link ${linkToCopy} disalin ke clipboard!`);
        
        // Ubah teks tombol sementara
        this.innerHTML = 'Disalin!';
        setTimeout(() => {
          this.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="14" height="14" fill="currentColor" style="display: inline-block; vertical-align: middle; margin-right: 5px;"><path d="M384 336H192c-8.8 0-16-7.2-16-16V16c0-8.8 7.2-16 16-16h192c8.8 0 16 7.2 16 16v304c0 8.8-7.2 16-16 16zM208 384c-35.3 0-64 28.7-64 64V464c0 8.8 7.2 16 16 16h192c8.8 0 16-7.2 16-16v-16c0-35.3-28.7-64-64-64H208zM160 96H64c-8.8 0-16 7.2-16 16v304c0 8.8 7.2 16 16 16h192c8.8 0 16-7.2 16-16v-16c0-35.3-28.7-64-64-64H160V96z"/></svg> Copy Link`;
        }, 2000);
        
      });
    });
  }

  // Panggil fungsi render saat halaman dimuat
  renderProducts();


  // --- 5. LOGIKA MODAL WITHDRAW ---

  // Ambil semua elemen modal
  const showWithdrawBtn = document.getElementById('show-withdraw-modal-btn');
  const withdrawFormModal = document.getElementById('withdraw-form-modal');
  const closeWithdrawFormBtn = document.getElementById('close-withdraw-form-modal');
  const withdrawForm = document.getElementById('withdraw-form');
  
  const notifyModal = document.getElementById('withdraw-notify-modal');
  const notifyModalTitle = document.getElementById('notify-modal-title');
  const notifyModalMessage = document.getElementById('notify-modal-message');
  const closeNotifyBtn = document.getElementById('close-notify-modal');
  const closeNotifyBtnMain = document.getElementById('close-notify-modal-btn');

  // Tampilkan Modal Form
  if(showWithdrawBtn) {
    showWithdrawBtn.addEventListener('click', () => {
      withdrawFormModal.classList.add('show-modal');
    });
  }

  // Sembunyikan Modal Form
  if(closeWithdrawFormBtn) {
    closeWithdrawFormBtn.addEventListener('click', () => {
      withdrawFormModal.classList.remove('show-modal');
    });
  }
  
  // Aksi saat form disubmit
  if(withdrawForm) {
    withdrawForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // 1. Sembunyikan modal form
      withdrawFormModal.classList.remove('show-modal');
      
      // 2. Cek status blokir dari "Admin"
      if (isWithdrawalBlocked) {
        // Jika diblokir
        notifyModalTitle.textContent = 'Penarikan Gagal';
        notifyModalMessage.textContent = 'Silahkan upgrade membership untuk melanjutkan withdraw.';
      } else {
        // Jika diizinkan
        notifyModalTitle.textContent = 'Penarikan Sukses';
        notifyModalMessage.textContent = 'Permintaan penarikan Anda telah dikirim dan sedang diproses.';
      }
      
      // 3. Tampilkan modal notifikasi
      notifyModal.classList.add('show-modal');
      
      // 4. Reset form (opsional)
      withdrawForm.reset();
    });
  }

  // Sembunyikan Modal Notifikasi (Tombol 'X')
  if(closeNotifyBtn) {
    closeNotifyBtn.addEventListener('click', () => {
      notifyModal.classList.remove('show-modal');
    });
  }
  
  // Sembunyikan Modal Notifikasi (Tombol 'Tutup')
  if(closeNotifyBtnMain) {
    closeNotifyBtnMain.addEventListener('click', () => {
      notifyModal.classList.remove('show-modal');
    });
  }
  
  // Sembunyikan modal jika klik di luar
  [withdrawFormModal, notifyModal].forEach(modal => {
    if(modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('show-modal');
        }
      });
    }
  });

});