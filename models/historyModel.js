const { db } = require('../config/db');

async function getHistoriesByUserId(userId) {
  const [rows] = await db.query(
    'SELECT age, hypertension, heart_disease, body_mass_index, HbA1c_level, blood_glucose_level, gender, smoking_history, diabetes_category, check_date FROM histories WHERE user_id = ?',
    [userId]
  );
  return rows;
}

module.exports = { getHistoriesByUserId };
