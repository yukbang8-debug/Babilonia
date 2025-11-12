/* =========================================
   FILE: server/routes/auth.js
   DESKRIPSI: Papan Petunjuk (Routes) untuk Login & Register - UPDATED
   ========================================= */

// 1. Memuat "alat" Express dan Routernya
const express = require('express');
const router = express.Router();

// 2. Memuat "Logika" (Controller) - (File ini SEKARANG SUDAH ADA)
const { registerUser, loginUser } = require('../controllers/authController'); // <-- BARIS BARU

// 3. Mendefinisikan "Pintu-Pintu"
// Kita akan membuat 2 pintu:
// - /api/auth/register
// - /api/auth/login

/**
 * @route   POST /api/auth/register
 * @desc    Mendaftarkan user baru
 * @access  Publik
 */
// Kita ganti fungsi dummy dengan fungsi asli dari controller
router.post('/register', registerUser); // <-- BARIS INI DIUBAH

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Publik
 */
// Kita ganti juga untuk login, meskipun logikanya belum lengkap
router.post('/login', loginUser); // <-- BARIS INL DIUBAH

// 4. Ekspor "Papan Petunjuk" ini
module.exports = router;