const { format } = require('date-fns');
const { db } = require('../db');

// Fungsi untuk mendapatkan histori pengguna
async function getHistories(req, res) {
  const userId = req.user.userId; // Ambil userId dari token JWT

  // Ambil data histori dari database berdasarkan userId
  const [rows] = await db.query('SELECT complaint_disease, check_result, check_date FROM histories WHERE user_id = ?', [userId]);

  if (rows.length === 0) {
    return res.status(404).json({ error: true, message: 'No history found' });
  }

  // Format tanggal sebelum mengirimkan respon
  const formattedHistories = rows.map(history => ({
    ...history,
    check_date: format(new Date(history.check_date), 'yyyy-MM-dd HH:mm:ss'), // Format tanggal
  }));

  res.json({
    error: false,
    histories: formattedHistories,
  });
}

module.exports = { getHistories };
