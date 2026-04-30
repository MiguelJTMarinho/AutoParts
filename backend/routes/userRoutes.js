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
    res.status(200).json(data);
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

    res.status(200).json(user);
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

// @route PUT /api/users/profile
// @desc Update logged-in user profile
// @access Private
router.put("/profile", protect, async (req, res) => {
  try {
    const updatedUser = await userService.updateUser(req.user.id, req.body);

    res.json(updatedUser);
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
});

// @route POST /api/users/forgot_password
// @desc Request password reset
// @access Public
router.post("/forgot_password", async (req, res) => {
  try {
    const data = await userService.forgotPassword(req.body.email);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route POST /api/users/reset_password
// @desc Reset user password
// @access Public
router.post("/reset_password", async (req, res) => {
  try {
    const data = await userService.resetPassword(req.body);
    res.json(data);
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
});

// @route PUT /api/users/change_password
// @desc Change user password (logged in)
// @access Private
router.put("/change_password", protect, async (req, res) => {
  try {
    const { current_password, new_password } = req.body;

    const data = await userService.changePassword(
      req.user.id,
      current_password,
      new_password,
    );

    res.json(data);
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
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
 *     description: Creates a new user account (username is generated automatically)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *               - email
 *               - password
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: Miguel
 *               last_name:
 *                 type: string
 *                 example: Marinho
 *               email:
 *                 type: string
 *                 example: miguel@email.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: User created successfully
 *       400:
 *         description: Validation error
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
 *                 example: miguel@email.com
 *               password:
 *                 type: string
 *                 example: 123456
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

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update logged-in user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     description: Update user profile (username, first name, last name)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: miguel_dev
 *               first_name:
 *                 type: string
 *                 example: Miguel
 *               last_name:
 *                 type: string
 *                 example: Marinho
 *               phone_number:
 *                 type: string
 *                 example: "+1234567890"
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/users/forgot_password:
 *   post:
 *     summary: Request password reset
 *     tags: [Users]
 *     description: Initiate the password reset process
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: miguel@email.com
 *     responses:
 *       200:
 *         description: Reset token generated
 *       400:
 *         description: Invalid email
 */

/**
 * @swagger
 * /api/users/reset_password:
 *   post:
 *     summary: Reset user password
 *     tags: [Users]
 *     description: Complete the password reset process
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - new_password
 *             properties:
 *               token:
 *                 type: string
 *                 example: abc123def456
 *               new_password:
 *                 type: string
 *                 example: newpassword123
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid or expired token
 */

/**
 * @swagger
 * /api/users/change_password:
 *   put:
 *     summary: Change user password (logged in)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     description: Update the authenticated user's password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - current_password
 *               - new_password
 *             properties:
 *               current_password:
 *                 type: string
 *                 example: currentpassword123
 *               new_password:
 *                 type: string
 *                 example: newpassword123
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Invalid current password or weak new password
 */

module.exports = router;
