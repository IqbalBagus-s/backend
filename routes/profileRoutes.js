const express = require('express');
const { getProfile, updateProfile } = require('../controllers/profileController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Rute untuk mendapatkan profil pengguna
router.get('/', authenticateToken, getProfile);

// Rute untuk memperbarui profil pengguna
router.put('/', authenticateToken, updateProfile);

module.exports = router;
