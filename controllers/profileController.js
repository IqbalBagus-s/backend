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

  try {
    // Ambil data pengguna saat ini untuk membandingkan perubahan melalui userModel
    const currentUser = await userModel.getUserById(userId);

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

    // Validasi jika name atau password sama dengan yang sebelumnya
    if (name && name === currentUser.name) {
      return res.status(400).json({ error: true, message: 'Username must be different from the previous one' });
    }

    if (password) {
      // Pastikan currentUser.password ada sebelum memverifikasi password
      if (!currentUser.password) {
        return res.status(400).json({ error: true, message: 'Current password not found in database' });
      }

      const isPasswordValid = await bcrypt.compare(password, currentUser.password);
      if (isPasswordValid) {
        return res.status(400).json({ error: true, message: 'Password must be different from the previous one' });
      }
    }

    // Update data profil pengguna menggunakan model
    await userModel.updateUserProfile(userId, name, password, currentUser.name, currentUser.password);

    res.json({ error: false, message: 'Profile updated successfully' });
  } catch (error) {
    // Hanya kirimkan response error tanpa mencetak ke console
    res.status(400).json({ error: true, message: 'Failed to update profile' });
  }
}



module.exports = { getProfile, updateProfile };
