const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const allRoutes = require('./routes/allRoutes'); // Mengimpor allRoutes yang sudah digabungkan

dotenv.config();

const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors()); // Enable CORS for all origins

// Routes
app.use('/api', allRoutes); // Menggunakan allRoutes yang sudah digabungkan, prefix /api untuk semua rute

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
