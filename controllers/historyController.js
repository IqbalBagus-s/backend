// controllers/historyController.js
const { format } = require('date-fns');
const historyModel = require('../models/historyModel');

async function getHistories(req, res) {
  const userId = req.user.userId; // Ambil userId dari token JWT

  // Ambil data histori menggunakan model
  const histories = await historyModel.getHistoriesByUserId(userId);

  if (histories.length === 0) {
    return res.status(404).json({ error: true, message: 'No history found' });
  }

  // Format tanggal sebelum mengirimkan respon
  const formattedHistories = histories.map(history => ({
    ...history,
    check_date: format(new Date(history.check_date), 'yyyy-MM-dd HH:mm:ss'), // Format tanggal
  }));

  res.json({
    error: false,
    histories: formattedHistories,
  });
}

module.exports = { getHistories };
