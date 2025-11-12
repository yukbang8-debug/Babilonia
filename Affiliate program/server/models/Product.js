/* =========================================
   FILE: server/models/Product.js
   DESKRIPSI: Cetak Biru (Schema) untuk Data Produk
   ========================================= */

// 1. Memuat "alat" Mongoose
const mongoose = require('mongoose');

// 2. Membuat "Cetak Biru" (Schema)
const ProductSchema = new mongoose.Schema({
  namaProduk: {
    type: String,
    required: true
  },
  harga: {
    type: String, // Kita pakai String agar bisa menulis "Rp 500.000"
    required: true
  },
  linkAffiliate: { // Link asli dari vendor
    type: String,
    required: true
  },
  urlGambar: {
    type: String,
    required: true,
    default: 'https://via.placeholder.com/100/64FFDA/0A192F?text=PRODUK' // Gambar default
  },
  komisiStandar: { // Komisi default produk
    type: Number,
    required: true
  },
  levelMinimum: { // Level minimum untuk UNLOCK produk
    type: String,
    enum: ['Warrior', 'Master', 'Grandmaster', 'Epic', 'Legend', 'Mytic'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 3. Ekspor "Cetak Biru" ini agar bisa digunakan
module.exports = mongoose.model('Product', ProductSchema);