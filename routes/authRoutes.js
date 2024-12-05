const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');

const router = express.Router();

// Rute untuk register
router.post('/register', registerUser);  // Menggunakan '/register'

// Rute untuk login
router.post('/login', loginUser);  // Menggunakan '/login'

module.exports = router;
