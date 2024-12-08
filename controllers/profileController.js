// controllers/profileController.js
const userModel = require('../models/userModel');

async function getProfile(req, res) {
  const userId = req.user.userId; // Ambil userId dari token JWT

  // Ambil data profil pengguna menggunakan model
  const user = await userModel.getUserById(userId);
  
  if (!user) {
    return res.status(404).json({ error: true, message: 'User not found' });
  }

  res.json({
    error: false,
    user: {
      name: user.name,
      email: user.email,
    },
  });
}

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

  try {
    // Update data profil pengguna menggunakan model
    await userModel.updateUserProfile(userId, name, password);

    res.json({ error: false, message: 'Profile updated successfully' });
  } catch (error) {
    // Menangani error yang mungkin terjadi selama query
    console.error(error);
    res.status(500).json({ error: true, message: 'Failed to update profile' });
  }
}

module.exports = { getProfile, updateProfile };
