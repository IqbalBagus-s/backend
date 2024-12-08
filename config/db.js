const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

// Memuat variabel environment dari file .env
dotenv.config();

// Membuat koneksi pool ke Cloud SQL
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

module.exports = { db: pool };
