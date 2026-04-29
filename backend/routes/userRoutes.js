// userRoutes.js
const express = require("express");
const router = express.Router();

const userService = require("../service/userService");
const { isAdmin } = require("../middleware/authMiddleware");
const protect = require("../middleware/authMiddleware").protect;

// @route POST /api/users/register
// @desc Register a new user
// @acess Private (Admin)
router.post("/register", async (req, res) => {
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

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User authentication and profile management
 */

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     description: Creates a new user account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Miguel
 *               lastName:
 *                 type: string
 *                 example: Marinho
 *               email:
 *                 type: string
 *                 example: miguel@email.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       201:
 *         description: User created successfully
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Authenticate user
 *     tags: [Users]
 *     description: Login and return JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: email@email.com
 *               password:
 *                 type: string
 *                 example: password
 *     responses:
 *       200:
 *         description: Login successful (returns user + JWT token)
 *       401:
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get logged-in user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     description: Returns the authenticated user data from JWT token
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       401:
 *         description: Unauthorized (missing or invalid token)
 */

module.exports = router;
