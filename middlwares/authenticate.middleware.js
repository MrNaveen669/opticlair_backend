const jwt = require('jsonwebtoken');
const User = require('../Models/user.model'); // Corrected import - assuming your User model is in this file

// Express middleware for authentication
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Invalid or missing authorization header');
    }

    const token = authHeader.split(' ')[1];

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!decoded || !decoded.id) {
      throw new Error('Invalid token structure');
    }

    // Find user by decoded ID
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new Error('User not found');
    }

    // Check for admin privileges if required
    if (requireAdmin && !user.isAdmin) {
      throw new Error('Access denied: Admins only');
    }

    // Attach user to request
    req.user = user;
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      throw new Error('JWT malformed or invalid');
    }
    throw err;
  }
};

// Middleware to check if user is authenticated
exports.isAuth = async (req, res, next) => {
  try {
    await authenticate(req);
    next();
  } catch (error) {
    console.error('Auth error:', error.message);
    res.status(401).json({ error: error.message });
  }
};

// Middleware to check if user is an admin
exports.isAdmin = async (req, res, next) => {
  try {
    await authenticate(req, true);
    next();
  } catch (error) {
    console.error('Admin auth error:', error.message);
    res.status(401).json({ error: error.message });
  }
};