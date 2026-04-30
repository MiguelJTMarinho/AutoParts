const express = require("express");
const router = express.Router();

const service = require("../service/addressesService");
const { protect } = require("../middleware/authMiddleware");

// @route POST /api/addresses
// @desc Create new address
// @access Private
router.post("/", protect, async (req, res) => {
  try {
    const data = await service.createAddress(req.user.id, req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
});

// @route GET /api/addresses
// @desc Get my addresses
// @access Private
router.get("/", protect, async (req, res) => {
  try {
    const data = await service.getMyAddresses(req.user.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route GET /api/addresses/:id
// @desc Get single address
// @access Private
router.get("/:id", protect, async (req, res) => {
  try {
    const data = await service.getAddress(req.user.id, req.params.id);
    res.json(data);
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
});

// @route PUT /api/addresses/:id
// @desc Update address
// @access Private
router.put("/:id", protect, async (req, res) => {
  try {
    const data = await service.updateAddress(
      req.user.id,
      req.params.id,
      req.body,
    );
    res.json(data);
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
});

// @route DELETE /api/addresses/:id
// @desc Delete address
// @access Private
router.delete("/:id", protect, async (req, res) => {
  try {
    const data = await service.deleteAddress(req.user.id, req.params.id);
    res.json({ message: "Deleted successfully", data });
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
});

/**
 * @swagger
 * tags:
 *   name: Addresses
 *   description: User address management
 */

/**
 * @swagger
 * /api/addresses:
 *   post:
 *     summary: Create a new address
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     description: Create a new address for the authenticated user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - address_line_1
 *               - country
 *               - city
 *               - postal_code
 *             properties:
 *               title:
 *                 type: string
 *                 example: Home
 *               address_line_1:
 *                 type: string
 *                 example: Rua das Flores 123
 *               address_line_2:
 *                 type: string
 *                 example: 2º Esq
 *               country:
 *                 type: string
 *                 example: Portugal
 *               city:
 *                 type: string
 *                 example: Porto
 *               postal_code:
 *                 type: string
 *                 example: 4000-123
 *     responses:
 *       201:
 *         description: Address created successfully
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/addresses:
 *   get:
 *     summary: Get all addresses of logged-in user
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve all addresses associated with the authenticated user
 *     responses:
 *       200:
 *         description: List of addresses
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/addresses/{id}:
 *   get:
 *     summary: Get address by ID
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve a specific address belonging to the authenticated user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Address ID
 *     responses:
 *       200:
 *         description: Address retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Address not found
 */

/**
 * @swagger
 * /api/addresses/{id}:
 *   put:
 *     summary: Update an address
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     description: Update an existing address of the authenticated user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Address ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Work
 *               address_line_1:
 *                 type: string
 *                 example: Avenida da Boavista 500
 *               address_line_2:
 *                 type: string
 *                 example: Sala 3
 *               country:
 *                 type: string
 *                 example: Portugal
 *               city:
 *                 type: string
 *                 example: Porto
 *               postal_code:
 *                 type: string
 *                 example: 4100-125
 *     responses:
 *       200:
 *         description: Address updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Address not found
 */

/**
 * @swagger
 * /api/addresses/{id}:
 *   delete:
 *     summary: Delete an address
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     description: Delete an address belonging to the authenticated user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Address ID
 *     responses:
 *       200:
 *         description: Address deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Address not found
 */

module.exports = router;
