const { db } = require('../config/db');
const bcrypt = require('bcrypt');

// Fungsi untuk mencari user berdasarkan email
async function findUserByEmail(email) {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
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


// Fungsi untuk mendapatkan data profil pengguna berdasarkan userId
async function getUserById(userId) {
    const [rows] = await db.query('SELECT name, email FROM users WHERE id = ?', [userId]);
    return rows.length > 0 ? rows[0] : null;
  }
  
  // Fungsi untuk memperbarui data pengguna (name dan password)
  async function updateUserProfile(userId, name, password) {
    let hashedPassword = null;
  
    // Jika password diubah, hash password terlebih dahulu
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }
  
    // Update data pengguna di database
    await db.query('UPDATE users SET name = ?, password = ? WHERE id = ?', [
      name || null,
      hashedPassword || null,
      userId,
    ]);
}
module.exports = { findUserByEmail, createUser, verifyPassword, getUserById, updateUserProfile };
