// userRoutes.js
const express = require("express");
const router = express.Router();

const userService = require("../service/userService");
const { isAdmin } = require("../middleware/authMiddleware");
const protect = require("../middleware/authMiddleware").protect;

// @route POST /api/users/register
// @desc Register a new user
// @acess Private (Admin)
router.post("/register", protect, isAdmin, async (req, res) => {
  try {
    const data = await userService.registerUser(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route POST /api/users/login
// @desc Authenticate user
// @acess Public
router.post("/login", async (req, res) => {
  try {
    const user = await userService.loginUser(req.body);

    res.status(201).json(user);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

// @route GET /api/users/profile
// @desc Get logged-in user's profile (Protected Route)
// @acess Private
router.get("/profile", protect, async (req, res) => {
  res.json(req.user);
});

module.exports = router;
