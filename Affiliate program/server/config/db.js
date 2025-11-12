/* =========================================
   FILE: server/config/db.js
   DESKRIPSI: File untuk menyambungkan ke Database MongoDB
   ========================================= */

// 1. Memuat "alat" Mongoose
const mongoose = require('mongoose');

// 2. Alamat "Memori" (Database) kita
// Ini adalah alamat standar untuk database MongoDB yang berjalan di komputer/server Anda.
const dbURL = 'mongodb://localhost:27017/websiteAfiliasiDB';

// 3. Fungsi untuk menyambungkan
const connectDB = async () => {
  try {
    // Mencoba menyambungkan ke alamat database
    await mongoose.connect(dbURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Database berhasil tersambung...');

  } catch (err) {
    // Jika gagal, tampilkan error dan matikan server
    console.error('❌ Gagal menyambung ke database!');
    console.error(err.message);
    process.exit(1); // Matikan aplikasi jika tidak bisa konek ke DB
  }
};

// 4. Ekspor fungsi ini agar bisa dipakai oleh server.js
module.exports = connectDB;