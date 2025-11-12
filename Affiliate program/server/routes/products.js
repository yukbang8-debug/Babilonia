/* =========================================
   FILE: server/routes/products.js
   DESKRIPSI: Papan Petunjuk (Routes) untuk Produk - FINAL
   ========================================= */

// 1. Memuat "alat" Express dan Routernya
const express = require('express');
const router = express.Router();

// 2. Memuat "Satpam" (Middleware)
const authMiddleware = require('../middleware/authMiddleware');

// 3. Memuat "Logika" (Controller) - (SEKARANG SUDAH ADA)
const { getAllProducts } = require('../controllers/productController'); // <-- BARIS BARU

/**
 * @route   GET /api/products
 * @desc    Mengambil semua data produk
 * @access  Private (Hanya untuk user yang login)
 */

// KITA GANTI FUNGSI DUMMY DENGAN LOGIKA ASLI (BARU)
// Server akan:
// 1. Menerima request ke '/'
// 2. Menjalankan "authMiddleware" (Satpam) dulu
// 3. Jika "Satpam" bilang OK (lolos), jalankan "getAllProducts"
router.get('/', authMiddleware, getAllProducts); // <-- BARIS INI DIUBAH

// 4. Ekspor "Papan Petunjuk" ini
module.exports = router;