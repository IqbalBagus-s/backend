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
async function updateUserProfile(userId, name, password, currentName, currentPassword) {
    let query = 'UPDATE users SET';
    let updateValues = [];
    let hasUpdates = false;
  
    // Memperbarui kolom name jika ada perubahan
    if (name && name !== currentName) {
      updateValues.push(name);
      query += ` name = ?`;
      hasUpdates = true;
    }
  
    // Memperbarui kolom password jika ada perubahan
    if (password && password !== currentPassword) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateValues.push(hashedPassword);
      query += `, password = ?`;
      hasUpdates = true;
    }
  
    if (!hasUpdates) {
      throw new Error('No changes detected');
    }
  
    query += ' WHERE id = ?';
    updateValues.push(userId);
  
    await db.query(query, updateValues);
}
  
module.exports = { findUserByEmail, createUser, verifyPassword, getUserById, updateUserProfile };
