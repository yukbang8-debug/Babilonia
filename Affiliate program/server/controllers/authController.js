/* =========================================
   FILE: server/controllers/authController.js
   DESKRIPSI: Logika "Nyata" untuk Register & Login - UPDATED
   ========================================= */

// 1. Memuat "Alat"
const bcrypt = require('bcryptjs'); // Untuk enkripsi & perbandingan password
const jwt = require('jsonwebtoken'); // Untuk "Tiket" (Token)

// 2. Memuat "Cetak Biru" (Models)
const User = require('../models/User'); // Cetak biru User

// 3. Rahasia untuk "Tiket" (Token)
const JWT_SECRET = 'RAHASIA_ANDA_YANG_SANGAT_SULIT_DITEBAK_12345';


// ==============================
// FUNGSI 1: REGISTER USER BARU (Tetap Sama)
// ==============================
const registerUser = async (req, res) => {
  const { username, email, password, noHp } = req.body;

  try {
    let user = await User.findOne({ email: email });
    if (user) {
      return res.status(400).json({ message: 'Email sudah terdaftar' });
    }

    user = new User({
      username: username,
      email: email,
      password: password,
      noHp: noHp
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({ token: token }); 
      }
    );

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


// ==============================
// FUNGSI 2: LOGIN USER (BARU & LENGKAP)
// ==============================
const loginUser = async (req, res) => {
  // Ambil data dari request (yang dikirim oleh form login)
  const { email, password } = req.body;

  try {
    // === Langkah 1: Cek apakah user ada ===
    let user = await User.findOne({ email: email });
    if (!user) {
      // Jika user TIDAK ditemukan
      return res.status(400).json({ message: 'Email atau Password salah' });
    }

    // === Langkah 2: Bandingkan Password ===
    // 'password' = password mentah dari form
    // 'user.password' = password terenkripsi dari database
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      // Jika password TIDAK cocok
      return res.status(400).json({ message: 'Email atau Password salah' });
    }

    // === Langkah 3: Jika password benar, Buat "Tiket" (Token) ===
    const payload = {
      user: {
        id: user.id // ID unik dari database
      }
    };

    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: '7d' }, // Tiket berlaku selama 7 hari
      (err, token) => {
        if (err) throw err;
        // Kirim balasan sukses beserta "Tiket" (Token)
        res.json({ token: token }); 
      }
    );

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


// 4. Ekspor semua fungsi ini
module.exports = {
  registerUser,
  loginUser
};