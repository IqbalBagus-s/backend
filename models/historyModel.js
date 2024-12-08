const { db } = require('../config/db');

async function getHistoriesByUserId(userId) {
  const [rows] = await db.query(
    'SELECT complaint_disease, check_result, check_date FROM histories WHERE user_id = ?',
    [userId]
  );
  return rows;
}

module.exports = { getHistoriesByUserId };
