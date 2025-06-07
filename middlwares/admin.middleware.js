const jwt = require('jsonwebtoken');
const { User } = require('../Models/user.model'); // Adjust path as needed

// Admin authentication middleware
const adminAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization');
    
    if (!token || !token.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided or invalid format."
      });
    }

    // Extract token from "Bearer TOKEN"
    const actualToken = token.split(' ')[1];
    
    if (!actualToken) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Token not found."
      });
    }

    // Verify token
    const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);
    
    // Find user and check if they exist
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid token. User not found."
      });
    }

    // Check if user is admin
    if (!user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required."
      });
    }

    // Add user info to request
    req.userId = user._id;
    req.user = user;
    req.isAdmin = true;
    
    next();
  } catch (error) {
    console.error('Admin auth middleware error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: "Invalid token."
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: "Token expired. Please login again."
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Internal server error during authentication."
    });
  }
};

// Optional: Admin or Owner check (for super admin features)
const adminOrOwnerAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization');
    
    if (!token || !token.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided."
      });
    }

    const actualToken = token.split(' ')[1];
    const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid token. User not found."
      });
    }

    // Check if user is admin or owner
    if (!user.isAdmin && !user.isOwner) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin or Owner privileges required."
      });
    }

    req.userId = user._id;
    req.user = user;
    req.isAdmin = user.isAdmin;
    req.isOwner = user.isOwner;
    
    next();
  } catch (error) {
    console.error('Admin/Owner auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: "Authentication error."
    });
  }
};

module.exports = {
  adminAuth,
  adminOrOwnerAuth
};