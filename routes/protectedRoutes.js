const express = require('express');
const authenticateToken = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');

const router = express.Router();

// Accessible to any authenticated user
router.get('/me', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

// Accessible only to admin users
router.get('/admin', authenticateToken, authorizeRoles('admin'), (req, res) => {
  res.json({ message: 'Welcome, admin!' });
});

module.exports = router;
