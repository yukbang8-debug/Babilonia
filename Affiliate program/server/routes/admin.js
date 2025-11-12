/* =========================================
   FILE: server/routes/admin.js
   DESKRIPSI: Papan Petunjuk (Routes) untuk Admin - FINAL
   ========================================= */

// 1. Memuat "alat" Express dan Routernya
const express = require('express');
const router = express.Router();

// 2. Memuat "Logika" (Controller) - (SEKARANG SUDAH ADA)
const {
  createNewProduct,
  updateProduct,
  updateUser,
  updateGlobalSettings
} = require('../controllers/adminController'); // <-- BARIS BARU

// 3. Memuat "Satpam" (Middleware)
// KITA ASUMSIKAN SEMUA PINTU ADMIN HARUS AMAN
// (Nanti kita akan buat middleware khusus 'isAdmin')
const authMiddleware = require('../middleware/authMiddleware');

// 4. Mendefinisikan "Pintu-Pintu" Admin
// Kita akan tambahkan "Satpam" (authMiddleware) di semua pintu

/**
 * @route   POST /api/admin/products
 * @desc    Admin menambah produk baru
 * @access  Admin Only
 */
// Ganti fungsi dummy dengan controller asli
router.post('/products', authMiddleware, createNewProduct); // <-- BARIS DIUBAH

/**
 * @route   PUT /api/admin/products/:id
 * @desc    Admin meng-update produk
 * @access  Admin Only
 */
// Ganti fungsi dummy dengan controller asli
router.put('/products/:id', authMiddleware, updateProduct); // <-- BARIS DIUBAH

/**
 * @route   PUT /api/admin/users/:id
 * @desc    Admin meng-update data user
 * @access  Admin Only
 */
// Ganti fungsi dummy dengan controller asli
router.put('/users/:id', authMiddleware, updateUser); // <-- BARIS DIUBAH

/**
 * @route   POST /api/admin/settings
 * @desc    Admin meng-update pengaturan global
 * @access  Admin Only
 */
// Ganti fungsi dummy dengan controller asli
router.post('/settings', authMiddleware, updateGlobalSettings); // <-- BARIS DIUBAH


// 5. Ekspor "Papan Petunjuk" ini
module.exports = router;