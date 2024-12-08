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

  try {
    // Validasi input
    if (!name) {
      return res.status(400).json({ error: true, message: 'Username must be provided for update' });
    }

    if (!password) {
      return res.status(400).json({ error: true, message: 'Password must be provided for update' });
    }

    if (name.length < 12) {
      return res.status(400).json({ error: true, message: 'Username must be at least 12 characters long' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: true, message: 'Password must be at least 8 characters long' });
    }

    // Ambil data pengguna saat ini
    const currentUser = await getUserById(userId);

    if (!currentUser) {
      return res.status(404).json({ error: true, message: 'User not found' });
    }

    // Periksa apakah name atau password sama dengan data sebelumnya
    const isNameSame = currentUser.name === name;
    const isPasswordSame = await bcrypt.compare(password, currentUser.password); // Bandingkan password

    if (isNameSame) {
      return res.status(400).json({
        error: true,
        message: 'New username and password must be different from the current values',
      });
    }

    if (isPasswordSame) {
      return res.status(400).json({
        error: true,
        message: 'New username and password must be different from the current values',
      });
    }

    // Hash password baru jika berbeda
    const hashedPassword = isPasswordSame ? currentUser.password : await bcrypt.hash(password, 10);

    // Update profil pengguna
    const updateResult = await updateUserProfile(userId, name !== currentUser.name ? name : null, hashedPassword);

    if (updateResult.affectedRows === 0) {
      return res.status(400).json({ error: true, message: 'No changes were made to the profile' });
    }

    res.json({ error: false, message: 'Profile updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, message: 'Internal server error' });
  }
}




module.exports = { getProfile, updateProfile };
