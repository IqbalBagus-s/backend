const bcrypt = require('bcrypt');
const { getUserById, updateUserProfile } = require('../models/userModel');

// Fungsi untuk mendapatkan profil pengguna
async function getProfile(req, res) {
  const userId = req.user.userId; // Ambil userId dari token JWT

  // Ambil data pengguna berdasarkan userId
  const user = await getUserById(userId);

  if (!user) {
    return res.status(404).json({ error: true, message: 'User not found' });
  }

  res.json({
    error: false,
    user: {
      name: user.name,
      email: user.email
    }
  });
}

// Fungsi untuk mengubah profil pengguna
async function updateProfile(req, res) {
  const userId = req.user.userId; // Ambil userId dari token JWT
  const { name, password } = req.body;

  // Validasi input: name atau password harus diisi
  if (!name && !password) {
    return res.status(400).json({ error: true, message: 'Username or password must be provided for update' });
  }

  // Validasi panjang name (jika diubah)
  if (name && name.length < 12) {
    return res.status(400).json({ error: true, message: 'Username must be at least 12 characters long' });
  }

  // Validasi panjang password (jika diubah)
  if (password && password.length < 8) {
    return res.status(400).json({ error: true, message: 'Password must be at least 8 characters long' });
  }

  // Jika password diubah, hash password terlebih dahulu
  let hashedPassword = null;
  if (password) {
    hashedPassword = await bcrypt.hash(password, 10);
  }

  // Pastikan bahwa jika name atau password diubah, mereka tidak kosong
  if (!name && !password) {
    return res.status(400).json({ error: true, message: 'Both name and password cannot be empty' });
  }

  // Update data pengguna
  await updateUserProfile(userId, name || undefined, hashedPassword || undefined);

  res.json({ error: false, message: 'Profile updated successfully' });
}


module.exports = { getProfile, updateProfile };
