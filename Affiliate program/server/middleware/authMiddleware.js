/* =========================================
   FILE: server/middleware/authMiddleware.js
   DESKRIPSI: "Satpam" (Middleware) untuk Cek Tiket (Token)
   ========================================= */

// 1. Memuat "Alat"
const jwt = require('jsonwebtoken');

// 2. Memuat Rahasia untuk "Tiket" (Token)
const JWT_SECRET = 'RAHASIA_ANDA_YANG_SANGAT_SULIT_DITEBAK_12345';

// 3. Membuat Fungsi "Satpam"
// Middleware adalah fungsi khusus yang memiliki 3 parameter: req, res, next
const authMiddleware = (req, res, next) => {
  // === Langkah 1: Ambil "Tiket" (Token) dari user ===
  // User akan mengirim tiket di 'Header' request,
  // dengan format: "Authorization: Bearer [tokennya...]"
  const authHeader = req.header('Authorization');

  // === Langkah 2: Cek apakah tiketnya ada ===
  if (!authHeader) {
    return res.status(401).json({ message: 'Akses ditolak. Tidak ada tiket (token).' });
  }

  // Cek jika formatnya 'Bearer <token>'
  const token = authHeader.split(' ')[1];
  if (!token) {
      return res.status(401).json({ message: 'Akses ditolak. Format token salah.' });
  }

  try {
    // === Langkah 3: Verifikasi Tiket ===
    // 'jwt.verify' akan mengecek tiket menggunakan KUNCI RAHASIA
    const decoded = jwt.verify(token, JWT_SECRET);

    // === Langkah 4: Jika Tiket Asli ===
    // 'decoded' berisi payload (user.id) yang kita buat saat login
    // Kita "tempelkan" data user ini ke 'req'
    req.user = decoded.user;

    // Izinkan user lanjut ke tujuan (misal: ke controller produk)
    next();

  } catch (err) {
    // === Langkah 5: Jika Tiket Palsu/Kadaluarsa ===
    res.status(401).json({ message: 'Tiket (token) tidak valid.' });
  }
};

// 4. Ekspor "Satpam" ini
module.exports = authMiddleware;