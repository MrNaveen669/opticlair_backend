// const jwt = require('jsonwebtoken');
// const { userModel } = require('../Models/user.model');

// // Helper function to extract token from authorization header
// const extractToken = (authHeader) => {
//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return null;
//   }
//   return authHeader.split(' ')[1];
// };

// // Enhanced authentication middleware with better debugging
// exports.authenticate = async (req, res, next) => {
//   try {
//     // Get token from header
//     const authHeader = req.headers.authorization;
//     console.log('Auth Header:', authHeader); // Debug log
    
//     const token = extractToken(authHeader);
//     console.log('Extracted Token:', token ? `${token.substring(0, 20)}...` : 'null'); // Debug log
    
//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: "No authentication token provided"
//       });
//     }
    
//     // Check if token looks valid (basic format check)
//     if (token.split('.').length !== 3) {
//       console.log('Invalid token format - not 3 parts');
//       return res.status(401).json({
//         success: false,
//         message: "Invalid token format"
//       });
//     }
    
//     // Verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET || "masai");
//     console.log('Decoded token:', decoded); // Debug log
    
//     // Handle both userID and id from token (for compatibility)
//     const userId = decoded.userID || decoded.id;
    
//     if (!userId) {
//       console.log('No userId found in token');
//       return res.status(401).json({
//         success: false,
//         message: "Invalid token structure - no user ID"
//       });
//     }
    
//     // Find user
//     const user = await userModel.findById(userId);
    
//     if (!user) {
//       console.log('User not found for ID:', userId);
//       return res.status(401).json({
//         success: false,
//         message: "User not found"
//       });
//     }
    
//     // Attach user info to request for use in routes
//     req.user = user;
//     req.userId = user._id.toString(); // Ensure it's a string
//     req.isAdmin = user.isAdmin || false;
    
//     console.log('Authentication successful for user:', user.email);
//     next();
//   } catch (error) {
//     console.error('Auth error details:', {
//       name: error.name,
//       message: error.message,
//       token: req.headers.authorization ? 'Present' : 'Missing'
//     });
    
//     if (error.name === 'JsonWebTokenError') {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid or malformed token"
//       });
//     } else if (error.name === 'TokenExpiredError') {
//       return res.status(401).json({
//         success: false,
//         message: "Token expired"
//       });
//     }
    
//     return res.status(401).json({
//       success: false,
//       message: "Authentication failed",
//       error: error.message
//     });
//   }
// };

// // Admin middleware - FIXED
// exports.isAdmin = async (req, res, next) => {
//   try {
//     // Check if user is already authenticated (if authenticate middleware ran first)
//     if (req.user && req.isAdmin !== undefined) {
//       if (!req.isAdmin) {
//         return res.status(403).json({
//           success: false,
//           message: "Access denied: Admin privileges required"
//         });
//       }
//       return next();
//     }
    
//     // If not already authenticated, do full authentication
//     const token = extractToken(req.headers.authorization);
    
//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: "No authentication token provided"
//       });
//     }
    
//     // Check token format
//     if (token.split('.').length !== 3) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid token format"
//       });
//     }
    
//     // Verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET || "masai");
    
//     // Handle both userID and id from token
//     const userId = decoded.userID || decoded.id;
    
//     if (!userId) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid token structure"
//       });
//     }
    
//     // Find user
//     const user = await userModel.findById(userId);
    
//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "User not found"
//       });
//     }
    
//     // Check if user is admin
//     if (!user.isAdmin) {
//       return res.status(403).json({
//         success: false,
//         message: "Access denied: Admin privileges required"
//       });
//     }
    
//     // Attach user info to request
//     req.user = user;
//     req.userId = user._id.toString();
//     req.isAdmin = true;
    
//     next();
//   } catch (error) {
//     console.error('Admin auth error:', error);
    
//     if (error.name === 'JsonWebTokenError') {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid or malformed token"
//       });
//     } else if (error.name === 'TokenExpiredError') {
//       return res.status(401).json({
//         success: false,
//         message: "Token expired"
//       });
//     }
    
//     return res.status(401).json({
//       success: false,
//       message: "Authentication failed"
//     });
//   }
// };
// // Admin login (separate from user login)
// const adminLogin = async (email, password) => {
//   const response = await axios.post(`${BASE_URL}/auth/login`, {
//     email, password
//   });
  
//   if (response.data.success && response.data.user.isAdmin) {
//     localStorage.setItem('adminToken', response.data.token);
//     return true;
//   }
//   throw new Error('Admin access required');


// };

// module.exports = {
//   authenticate: exports.authenticate,
//   isAdmin: exports.isAdmin,
//   isAuth: exports.authenticate, // alias
//   adminLogin, // now exported
// };

// // Alternative legacy middleware names for backward compatibility
// // exports.isAuth = exports.authenticate;

const jwt = require('jsonwebtoken');
const { userModel } = require('../Models/user.model');

const JWT_SECRET = process.env.JWT_SECRET || "my_secret_key";

// Helper function to extract token from authorization header
const extractToken = (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.split(' ')[1];
};

// Enhanced authentication middleware
exports.authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log('Auth Header:', authHeader ? 'Present' : 'Missing');
    
    const token = extractToken(authHeader);
    console.log('Extracted Token:', token ? `${token.substring(0, 20)}...` : 'null');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No authentication token provided"
      });
    }
    
    // Check token format
    if (token.split('.').length !== 3) {
      console.log('Invalid token format');
      return res.status(401).json({
        success: false,
        message: "Invalid token format"
      });
    }
    
    // Verify token with correct secret
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Decoded token:', decoded);
    
    // Handle different token structures
    const userId = decoded.userID || decoded.id || decoded.userId;
    
    if (!userId) {
      console.log('No userId found in token');
      return res.status(401).json({
        success: false,
        message: "Invalid token structure - no user ID"
      });
    }
    
    // Find user
    const user = await userModel.findById(userId);
    
    if (!user) {
      console.log('User not found for ID:', userId);
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }
    
    // Attach user info to request
    req.user = user;
    req.userId = user._id.toString();
    req.isAdmin = user.isAdmin || false;
    
    console.log('Authentication successful for user:', user.email, 'isAdmin:', req.isAdmin);
    next();
  } catch (error) {
    console.error('Auth error details:', {
      name: error.name,
      message: error.message,
      token: req.headers.authorization ? 'Present' : 'Missing'
    });
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: "Invalid or malformed token"
      });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: "Token expired"
      });
    }
    
    return res.status(401).json({
      success: false,
      message: "Authentication failed",
      error: error.message
    });
  }
};

// Fixed Admin middleware
exports.isAdmin = async (req, res, next) => {
  try {
    console.log('Admin middleware called');
    
    // Check if user is already authenticated
    if (req.user && req.isAdmin !== undefined) {
      console.log('User already authenticated, isAdmin:', req.isAdmin);
      if (!req.isAdmin) {
        return res.status(403).json({
          success: false,
          message: "Access denied: Admin privileges required"
        });
      }
      return next();
    }
    
    // If not authenticated, do full authentication
    const authHeader = req.headers.authorization;
    const token = extractToken(authHeader);
    
    if (!token) {
      console.log('No token provided to admin middleware');
      return res.status(401).json({
        success: false,
        message: "No authentication token provided"
      });
    }
    
    // Check token format
    if (token.split('.').length !== 3) {
      return res.status(401).json({
        success: false,
        message: "Invalid token format"
      });
    }
    
    // Verify token with correct secret
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Admin token decoded:', decoded);
    
    // Handle different token structures
    const userId = decoded.userID || decoded.id || decoded.userId;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid token structure"
      });
    }
    
    // Find user
    const user = await userModel.findById(userId);
    
    if (!user) {
      console.log('User not found for admin check:', userId);
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }
    
    // Check if user is admin
    console.log('User found:', user.email, 'isAdmin:', user.isAdmin);
    if (!user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Access denied: Admin privileges required"
      });
    }
    
    // Attach user info to request
    req.user = user;
    req.userId = user._id.toString();
    req.isAdmin = true;
    
    console.log('Admin authentication successful for:', user.email);
    next();
  } catch (error) {
    console.error('Admin auth error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: "Invalid or malformed token"
      });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: "Token expired"
      });
    }
    
    return res.status(401).json({
      success: false,
      message: "Authentication failed"
    });
  }
};

module.exports = {
  authenticate: exports.authenticate,
  isAdmin: exports.isAdmin,
  isAuth: exports.authenticate
};