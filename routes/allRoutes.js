const express = require('express');
const { registerUser, loginUser, getHistories, getProfile, updateProfile } = require('../controllers/accountController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Rute untuk register
router.post('/register', registerUser);

// Rute untuk login
router.post('/login', loginUser);

// Rute untuk mendapatkan histori pengguna
router.get('/histories', authenticateToken, getHistories);

// Rute untuk mendapatkan profil pengguna
router.get('/profile', authenticateToken, getProfile);

// Rute untuk memperbarui profil pengguna
router.put('/profile', authenticateToken, updateProfile);

module.exports = router;
