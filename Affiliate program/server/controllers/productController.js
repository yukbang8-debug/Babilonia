/* =========================================
   FILE: server/controllers/productController.js
   DESKRIPSI: Logika "Nyata" untuk Produk
   ========================================= */

// 1. Memuat "Cetak Biru" (Models)
const Product = require('../models/Product');
const User = require('../models/User');

// 2. Definisikan Hirarki Level
// (Kita butuh ini untuk membandingkan level)
const levelHierarchy = {
  "Warrior": 1,
  "Master": 2,
  "Grandmaster": 3,
  "Epic": 4,
  "Legend": 5,
  "Mytic": 6
};

// ==============================
// FUNGSI 1: MENGAMBIL SEMUA PRODUK (UNTUK DASHBOARD)
// ==============================
const getAllProducts = async (req, res) => {
  try {
    // === Langkah 1: Dapatkan Info User ===
    // "Satpam" (authMiddleware) sudah memverifikasi tiket
    // dan menempelkan info user ke req.user
    const userId = req.user.id;

    // Cari user di database untuk dapat level & komisi khusus
    const user = await User.findById(userId).select('-password'); // -password = jangan ambil data password
    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    // === Langkah 2: Ambil Semua Produk ===
    const allProducts = await Product.find().sort({ createdAt: -1 }); // Urutkan dari yg terbaru

    // === Langkah 3: Proses Produk (Logika Kunci & Komisi) ===
    const currentUserLevelValue = levelHierarchy[user.level];

    // Kita 'map' (ubah) datanya sebelum dikirim ke front-end
    const processedProducts = allProducts.map(product => {
      
      const productLevelValue = levelHierarchy[product.levelMinimum];

      // 1. Cek apakah produk terkunci untuk user ini
      const isLocked = currentUserLevelValue < productLevelValue;

      // 2. Tentukan komisi yang akan ditampilkan
      let displayCommission;
      if (user.komisiKhusus !== null) {
        // Jika admin set komisi khusus, pakai itu
        displayCommission = user.komisiKhusus;
      } else {
        // Jika tidak, pakai komisi standar produk
        displayCommission = product.komisiStandar;
      }

      // 3. Buat objek baru yang "bersih" untuk dikirim ke front-end
      return {
        _id: product._id, // ID produk dari database
        namaProduk: product.namaProduk,
        harga: product.harga,
        urlGambar: product.urlGambar,
        komisi: displayCommission,
        isLocked: isLocked,
        levelMinimum: product.levelMinimum, // Untuk info 'Upgrade ke...'
        // Kirim link HANYA jika tidak terkunci
        linkAffiliate: isLocked ? null : product.linkAffiliate 
      };
    });

    // === Langkah 4: Kirim Hasil ===
    res.json(processedProducts);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


// 3. Ekspor fungsi ini
module.exports = {
  getAllProducts
};