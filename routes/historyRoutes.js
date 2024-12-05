const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');
const { getHistories } = require('../controllers/historyController');

const router = express.Router();

// Rute untuk mendapatkan histori pengguna
router.get('/', authenticateToken, getHistories);

module.exports = router;
