const jwt = require('jsonwebtoken');

// Middleware untuk autentikasi menggunakan JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"

  if (!token) return res.status(401).json({ status: 'error', message: 'Token missing' });
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ status: 'error', message: 'Invalid token' });

    req.user = user; // Menyimpan data pengguna
    next();
  });
}

module.exports = { authenticateToken };
