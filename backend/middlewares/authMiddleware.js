const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      console.log('Auth middleware - No token provided');
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Auth middleware - Token decoded:', decoded);

      // Get user from token
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        console.log('Auth middleware - User not found');
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      // Attach user to request
      req.user = user;
      console.log('Auth middleware - User attached to request:', user._id);
      next();
    } catch (error) {
      console.error('Auth middleware - Token verification failed:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { protect };