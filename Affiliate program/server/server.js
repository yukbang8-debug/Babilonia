/* =========================================
   FILE: server/server.js
   DESKRIPSI: File Utama Back-End (Mesin Server) - FINAL
   ========================================= */

// 1. Memuat "Alat" yang kita perlukan
const express = require('express');

// Memuat "Kabel" Database
const connectDB = require('./config/db');

// MEMUAT "PAPAN PETUNJUK"
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const adminRoutes = require('./routes/admin');

// 2. Menyalakan "Mesin" Express kita
const app = express();

// 3. Menghubungkan ke Database
connectDB();

// AKTIFKAN "PENERJEMAH JSON" (BARU)
// Ini adalah middleware bawaan Express.
// Ini memberitahu server cara membaca body JSON dari request (req.body).
app.use(express.json()); // <-- BARIS BARU YANG PENTING

// 4. Menentukan "Pintu" (PORT)
const PORT = 5000;

// 5. Membuat "Pintu API" (untuk testing)
app.get('/api/test', (req, res) => {
  res.json({ message: 'Halo! Server back-end Anda sudah berjalan!' });
});

// 6. MEMASANG "PAPAN PETUNJUK" KE JALAN UTAMA
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);

// 7. Menyalakan Server
app.listen(PORT, () => {
  console.log(`🚀 Server berhasil berjalan di http://localhost:${PORT}`);
});