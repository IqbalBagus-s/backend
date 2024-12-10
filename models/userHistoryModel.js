const { db } = require('../config/db');
const bcrypt = require('bcrypt');

// --- History Model ---
// Fungsi untuk mendapatkan histori berdasarkan userId
async function getHistoriesByName(name) {
  const [rows] = await db.query(
    'SELECT age, hypertension, heart_disease, body_mass_index, HbA1c_level, blood_glucose_level, gender, smoking_history, diabetes_category, check_date FROM histories WHERE name = ?',
    [name]
  );

  if (rows.length > 0) {
    return rows[0]; // Mengembalikan histori pertama yang ditemukan
  }

  return null; // Mengembalikan null jika tidak ditemukan
}

module.exports = { getHistoriesByName };

// --- User Model ---
// Fungsi untuk mencari user berdasarkan email
async function findUserByEmail(email) {
  const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  if (rows.length > 0) {
    return rows[0]; // Mengembalikan data pengguna pertama yang ditemukan
  }
  return null; // Mengembalikan null jika tidak ditemukan
}

// Fungsi untuk mencari user berdasarkan name
async function findUserByName(name) {
  const [rows] = await db.query('SELECT * FROM users WHERE name = ?', [name]);
  if (rows.length > 0) {
    return rows[0]; // Mengembalikan data pengguna pertama yang ditemukan
  }
  return null; // Mengembalikan null jika tidak ditemukan
}

async function createUser(name, email, password) {
  const [result] = await db.query(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, password]
  );
  return result.insertId;
}

// Fungsi untuk memverifikasi password pengguna
async function verifyPassword(inputPassword, hashedPassword) {
  return await bcrypt.compare(inputPassword, hashedPassword);
}

// Fungsi untuk mendapatkan profil pengguna berdasarkan userId
async function getUserById(userId) {
  const [rows] = await db.query('SELECT id, name, email, password FROM users WHERE id = ?', [userId]);
  if (rows.length === 0) {
    return null; // Jika tidak ada user ditemukan
  }
  return rows[0]; // Mengembalikan data user pertama
}

// Fungsi untuk memperbarui data profil pengguna (name dan password)
async function updateUserProfile(userId, name, password) {
  const query = `
    UPDATE users 
    SET 
      name = COALESCE(?, name), 
      password = COALESCE(?, password) 
    WHERE id = ?
  `;
  const [result] = await db.query(query, [name, password, userId]);
  console.log('Update Query Result:', result); // Debugging hasil query
  return result;
}

module.exports = {
  // History Model
  getHistoriesByName,
  // User Model
  findUserByEmail,
  findUserByName,
  createUser,
  verifyPassword,
  getUserById,
  updateUserProfile
};
