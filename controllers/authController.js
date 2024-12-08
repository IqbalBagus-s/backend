const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { findUserByEmail, createUser, verifyPassword } = require('../models/userModel');

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

module.exports = {registerUser, loginUser};
