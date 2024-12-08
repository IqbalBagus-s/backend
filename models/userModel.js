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






async function findUserById(userId) {
  const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
  return rows[0];
}

async function updateUser(userId, name, password) {
  await db.query(
    'UPDATE users SET name = ?, password = ? WHERE id = ?',
    [name, password, userId]
  );
}

module.exports = { findUserByEmail, createUser, verifyPassword, findUserById, updateUser };
