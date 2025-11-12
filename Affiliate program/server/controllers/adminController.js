/* =========================================
   FILE: server/controllers/adminController.js
   DESKRIPSI: Logika "Nyata" untuk Panel Admin
   ========================================= */

// 1. Memuat "Cetak Biru" (Models)
const Product = require('../models/Product');
const User = require('../models/User');

// ==============================
// === BAGIAN 1: LOGIKA PRODUK ===
// ==============================

/**
 * @desc    Admin menambah produk baru
 */
const createNewProduct = async (req, res) => {
  // Ambil semua data dari form admin
  const {
    namaProduk,
    harga,
    linkAffiliate,
    urlGambar,
    komisiStandar,
    levelMinimum
  } = req.body;

  try {
    // Buat produk baru di memori
    const newProduct = new Product({
      namaProduk,
      harga,
      linkAffiliate,
      urlGambar: urlGambar || undefined, // Gunakan 'default' di Model jika kosong
      komisiStandar,
      levelMinimum
    });

    // Simpan produk baru ke database
    const savedProduct = await newProduct.save();

    // Kirim balasan sukses
    res.status(201).json(savedProduct);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error saat menambah produk');
  }
};

/**
 * @desc    Admin meng-update produk
 */
const updateProduct = async (req, res) => {
  // Ambil ID produk dari URL (contoh: /api/admin/products/12345)
  const productId = req.params.id;

  // Ambil data baru dari form admin
  const {
    namaProduk,
    harga,
    linkAffiliate,
    urlGambar,
    komisiStandar,
    levelMinimum
  } = req.body;

  try {
    // Cari produk di database
    let product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Produk tidak ditemukan' });
    }

    // Update data produk dengan data baru
    product.namaProduk = namaProduk;
    product.harga = harga;
    product.linkAffiliate = linkAffiliate;
    product.urlGambar = urlGambar;
    product.komisiStandar = komisiStandar;
    product.levelMinimum = levelMinimum;

    // Simpan perubahan ke database
    const updatedProduct = await product.save();

    // Kirim balasan sukses
    res.json(updatedProduct);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error saat mengupdate produk');
  }
};


// ==============================
// === BAGIAN 2: LOGIKA USER ===
// ==============================

/**
 * @desc    Admin meng-update data user
 */
const updateUser = async (req, res) => {
  // Ambil ID user dari URL
  const userId = req.params.id;
  
  // Ambil data baru dari form admin
  const { username, email, noHp, level, komisi, komisiKhusus } = req.body;

  try {
    // Cari user di database
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    // Update data user
    user.username = username;
    user.email = email;
    user.noHp = noHp;
    user.level = level;
    user.metrics.komisi = komisi; // Update saldo komisi
    user.komisiKhusus = komisiKhusus === '' ? null : komisiKhusus; // Set ke null jika admin mengosongkan

    // Simpan perubahan
    await user.save();

    res.json(user); // Kirim data user yang sudah di-update

  } catch (err)
 {
    console.error(err.message);
    res.status(500).send('Server Error saat mengupdate user');
  }
};


// ==============================
// === BAGIAN 3: LOGIKA PENGATURAN ===
// ==============================
// (Kita buat kerangkanya dulu, ini butuh model baru)

const updateGlobalSettings = async (req, res) => {
  // Logika untuk menyimpan info bank, harga membership, dll.
  // Ini idealnya disimpan di Model 'Setting' yang terpisah.
  res.json({ message: 'ADMIN: Pengaturan global berhasil disimpan (logika belum selesai)' });
};


// 4. Ekspor semua fungsi admin
module.exports = {
  createNewProduct,
  updateProduct,
  updateUser,
  updateGlobalSettings
  // Nanti kita tambahkan deleteProduct, deleteUser, dll.
};