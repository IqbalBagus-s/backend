const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

// Membuat koneksi pool ke Cloud SQL menggunakan IP Publik
const pool = mysql.createPool({
  host: process.env.DB_HOST,  // Menggunakan IP Publik Cloud SQL (atau 'localhost' jika menggunakan proxy)
  user: process.env.DB_USER,   // Menggunakan variabel lingkungan untuk username
  password: process.env.DB_PASSWORD,  // Menggunakan variabel lingkungan untuk password
  database: process.env.DB_NAME  // Nama database Anda
});

module.exports = { db: pool };
