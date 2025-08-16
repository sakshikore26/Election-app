// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyToken = require('../middleware/authMiddleware');
// Signup route
router.post('/signup', authController.signup);

// Login route
router.post('/login', authController.login);

// Protected Profile route
router.get('/profile', verifyToken, (req, res) => {
  res.json({
    message: 'Access granted to profile',
    user: req.user, // This contains email and role from token
  });
});
module.exports = router;
