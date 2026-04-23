// backend/authMiddleware.js
const jwt = require("jsonwebtoken");
const { findUserById } = require("../repository/userRepository");
require("dotenv").config();

// Middleware to protect routes
const protect = async (req, res, next) => {
  let token;
  console.log("AUTH HEADER:", req.headers.authorization);

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await findUserById(decoded.user.id); //Exclude password
      next();
    } catch (error) {
      console.error("Token verification failed: ", error);
      res.status(401).json({ message: "Not authorized, token field" });
    }
  } else {
    res.status(401).json({ message: "Not Authorized, no token provided" });
  }
};

module.exports = { protect };
