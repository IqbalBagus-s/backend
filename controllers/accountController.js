const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { format } = require('date-fns');
const { findUserByEmail, findUserByName, createUser, verifyPassword, getUserById, updateUserProfile, getHistoriesByName } = require('../models/userHistoryModel');

// Fungsi register
async function registerUser(req, res) {
  const { name, email, password } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ status: 'error', message: 'Invalid email format' });
  }

  if (name.length < 8) {
    return res.status(400).json({ status: 'error', message: 'Username must have a minimum of 8 characters' });
  }

  if (password.length < 8) {
    return res.status(400).json({ status: 'error', message: 'Password must have a minimum of 8 characters' });
  }

  const existingUserByEmail = await findUserByEmail(email);
  if (existingUserByEmail) {
    return res.status(400).json({ status: 'error', message: 'Email is already registered.' });
  }

  const existingUserByName = await findUserByName(name);
  if (existingUserByName) {
    return res.status(400).json({ status: 'error', message: 'Username is already taken.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await createUser(name, email, hashedPassword);

  res.json({ status: 'success', message: 'User Created' });
}

// Fungsi login
async function loginUser(req, res) {
  const { email, password } = req.body;

  const user = await findUserByEmail(email);
  if (!user) {
    return res.status(400).json({ status: 'error', message: 'Invalid email or password' });
  }

  const isPasswordValid = await verifyPassword(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ status: 'error', message: 'Invalid email or password' });
  }

  const token = createToken(user);

  res.json({
    status: 'success',
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
    { expiresIn: '1h' }
  );
}

// Fungsi untuk mendapatkan histori pengguna
async function getHistories(req, res) {
  const userName = req.user.name;

  const histories = await getHistoriesByName(userName);

  if (histories.length === 0) {
    return res.status(404).json({ status: 'error', message: 'No history found' });
  }

  const formattedHistories = histories.map((history) => ({
    ...history,
    check_date: format(new Date(history.check_date), 'yyyy-MM-dd HH:mm:ss'),
  }));

  res.json({
    status: 'success',
    histories: formattedHistories,
  });
}


// Fungsi untuk mendapatkan profil pengguna
async function getProfile(req, res) {
  const userId = req.user.userId;

  const user = await getUserById(userId);

  if (!user) {
    return res.status(404).json({ status: 'error', message: 'User not found' });
  }

  res.json({
    status: 'success',
    user: {
      name: user.name,
      email: user.email,
    },
  });
}

// Fungsi untuk mengubah profil pengguna
async function updateProfile(req, res) {
  const userId = req.user.userId;
  const { name, password } = req.body;

  try {
    if (!name) {
      return res.status(400).json({ status: 'error', message: 'Username must be provided for update' });
    }

    if (!password) {
      return res.status(400).json({ status: 'error', message: 'Password must be provided for update' });
    }

    if (name.length < 8) {
      return res.status(400).json({ status: 'error', message: 'Username must be at least 8 characters long' });
    }

    if (password.length < 8) {
      return res.status(400).json({ status: 'error', message: 'Password must be at least 8 characters long' });
    }

    const currentUser = await getUserById(userId);

    if (!currentUser) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    const isNameSame = currentUser.name === name;
    const isPasswordSame = await bcrypt.compare(password, currentUser.password);

    if (isNameSame) {
      return res.status(400).json({
        status: 'error',
        message: 'New username and password must be different from the current values',
      });
    }

    if (isPasswordSame) {
      return res.status(400).json({
        status: 'error',
        message: 'New username and password must be different from the current values',
      });
    }

    const hashedPassword = isPasswordSame ? currentUser.password : await bcrypt.hash(password, 10);

    const updateResult = await updateUserProfile(userId, name !== currentUser.name ? name : null, hashedPassword);

    if (updateResult.affectedRows === 0) {
      return res.status(400).json({ status: 'error', message: 'No changes were made to the profile' });
    }

    res.json({ status: 'success', message: 'Profile updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ status: 'error', message: 'New username and password must be different from the current values' });
  }
}

module.exports = { registerUser, loginUser, getHistories, getProfile, updateProfile };
