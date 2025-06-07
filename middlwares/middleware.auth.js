const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ message: "Authentication failed: No token provided" });
  }
  
  try {    const decoded = jwt.verify(token, process.env.JWT_SECRET || "masai");
    req.userId = decoded.userId;
    req.isAdmin = decoded.isAdmin;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ message: "Authentication failed: Invalid token" });
  }
};

module.exports = {
  authenticate
};