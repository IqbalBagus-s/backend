const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { format } = require('date-fns');
const { findUserByEmail, createUser, verifyPassword, getUserById, updateUserProfile, getHistoriesByName } = require('../models/userHistoryModel');


// Fungsi register
async function registerUser(req, res) {
  const { name, email, password } = req.body;

  if (email.length < 8 || name.length < 8 || password.length < 8) {
    return res.status(400).json({ error: true, message: 'Input must be at least 8 characters long' });
  }

  // Validasi format email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex untuk format email valid
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: true, message: 'Invalid email format' });
  }

  // Validasi panjang username
  if (name.length < 8) {
    return res.status(400).json({ error: true, message: 'Username must have a minimum of 8 characters' });
  }

  // Validasi panjang password
  if (password.length < 8) {
    return res.status(400).json({ error: true, message: 'Password must have a minimum of 8 characters' });
  }

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    return res.status(400).json({ error: true, message: 'Email is already registered.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await createUser(name, email, hashedPassword);

  res.json({ error: false, message: 'User Created' });
}

// Fungsi login
async function loginUser(req, res) {
  const { email, password } = req.body;

  // Cari user berdasarkan email dengan model
  const user = await findUserByEmail(email);
  if (!user) {
    return res.status(400).json({ error: true, message: 'Invalid email or password' });
  }

  // Verifikasi password menggunakan model
  const isPasswordValid = await verifyPassword(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ error: true, message: 'Invalid email or password' });
  }

  // Buat JWT token
  const token = createToken(user);

  res.json({
    error: false,
    message: 'Login successful',
    loginResult: {
      userId: user.id,
      name: user.name,
      token,
    },
  });
}

function createToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      name: user.name,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' } // Token berlaku selama 1 jam
  );
}

// Fungsi untuk mendapatkan histori pengguna
async function getHistories(req, res) {
  const userName = req.user.name; // Ambil nama user dari token JWT

  // Ambil histori pertama menggunakan model
  const history = await getHistoriesByName(userName);

  // Tangani kasus ketika history adalah null
  if (!history) {
    return res.status(404).json({ error: true, message: 'No history found' });
  }

  // Format tanggal sebelum mengirimkan respon
  const formattedHistory = {
    ...history,
    check_date: format(new Date(history.check_date), 'yyyy-MM-dd HH:mm:ss'),
  };

  res.json({
    error: false,
    history: formattedHistory,
  });
}
  

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

module.exports = { registerUser, loginUser, getHistories, getProfile, updateProfile };
