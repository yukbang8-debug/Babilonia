/* =========================================
   FILE: server/models/User.js
   DESKRIPSI: Cetak Biru (Schema) untuk Data User
   ========================================= */

// 1. Memuat "alat" Mongoose
const mongoose = require('mongoose');

// 2. Membuat "Cetak Biru" (Schema)
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true // Wajib diisi
  },
  email: {
    type: String,
    required: true,
    unique: true // Email tidak boleh sama
  },
  password: {
    type: String,
    required: true
    // Catatan: Nanti kita akan tambahkan enkripsi di sini
  },
  noHp: {
    type: String,
    required: true
  },
  level: {
    type: String,
    enum: ['Warrior', 'Master', 'Grandmaster', 'Epic', 'Legend', 'Mytic'],
    default: 'Warrior' // User baru otomatis level Warrior
  },
  // Metrik (3 kolom di dashboard)
  metrics: {
    klik: {
      type: Number,
      default: 0
    },
    pesanan: {
      type: Number,
      default: 0
    },
    komisi: { // Ini adalah saldo komisi (Rp)
      type: Number,
      default: 0
    }
  },
  // Komisi Khusus (Override)
  komisiKhusus: {
    type: Number,
    default: null // null berarti tidak ada override
  },
  // Tanggal pendaftaran
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 3. Ekspor "Cetak Biru" ini agar bisa digunakan
// 'User' adalah nama yang akan kita gunakan di kode kita
module.exports = mongoose.model('User', UserSchema);