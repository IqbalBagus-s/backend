const mysql = require('mysql2/promise');

// Membuat koneksi pool ke Cloud SQL menggunakan IP Publik
const pool = mysql.createPool({
  host: '34.128.78.215',  // IP Publik Cloud SQL (ganti dengan IP yang sesuai)
  user: 'root',   // Username untuk Cloud SQL
  password: '',  // Password untuk Cloud SQL (ganti dengan password yang benar)
  database: 'auth_system'  // Nama database Anda
});

module.exports = { db: pool };
