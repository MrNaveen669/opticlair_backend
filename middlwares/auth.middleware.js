const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ message: "Unauthorized, Token missing" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user data to request
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid Token" });
    }
};

module.exports = authMiddleware;
