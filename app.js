const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes'); // Import profileRoutes
const historyRoutes = require('./routes/historyRoutes'); // Import historyRoutes

dotenv.config();

const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors()); // Enable CORS for all origins

// Routes
app.use('/auth', authRoutes); // Rute untuk login dan register
app.use('/profile', profileRoutes); // Rute untuk profile
app.use('/histories', historyRoutes); // Rute untuk histories


// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
