// backend/authMiddleware.js
const jwt = require("jsonwebtoken");
const Sentry = require("@sentry/node");
const { findUserById } = require("../repository/userRepository");
require("dotenv").config();

// Middleware to protect routes
const protect = async (req, res, next) => {
  //let token;
  //console.log("AUTH HEADER:", req.headers.authorization);

  //if (
  //  req.headers.authorization &&
  //  req.headers.authorization.startsWith("Bearer")
  //) {
  try {
    //token = req.headers.authorization.split(" ")[1];

    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await findUserById(decoded.user.id); //Exclude password

    // Attach user to Sentry Context
    Sentry.setUser({
      id: req.user.id,
      email: req.user.email,
    });

    next();
  } catch (error) {
    console.error("Token verification failed: ", error);
    Sentry.captureException(error);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
  //} else {
  //  res.status(401).json({ message: "Not Authorized, no token provided" });
  //}
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Admin only" });
  }
};

const optionalAuth = async (req, res, next) => {
  //const header = req.headers.authorization;
  const token = req.cookies.token;

  //if (!token || !header.startsWith("Bearer ")) {
  if (!token) {
    return next(); // segue como guest
  }

  try {
    //token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await findUserById(decoded.user.id); //Exclude password
  } catch (err) {
    // ignora erro → trata como guest
  }

  next();
};

module.exports = { protect, isAdmin, optionalAuth };
