const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  googleAuth,
  forgotPassword,
  resetPassword
} = require('../controllers/authController');

const protect = require('../middlewares/authMiddleware');


// Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.post('/google', googleAuth);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;
