const express = require("express");
const router = express.Router();

const service = require("../service/wishlistService");
const { protect } = require("../middleware/authMiddleware");

// @route POST /api/wishlist
// @desc Add product to wishlist
// @access Private
router.post("/", protect, async (req, res) => {
  try {
    const data = await service.add(req.user.id, req.body.product_id);
    res.status(201).json(data);
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
});

// @route GET /api/wishlist
// @desc Get my wishlist
// @access Private
router.get("/", protect, async (req, res) => {
  try {
    const data = await service.getMyWishlist(req.user.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route DELETE /api/wishlist/:product_id
// @desc Remove product from wishlist
// @access Private
router.delete("/:product_id", protect, async (req, res) => {
  try {
    const data = await service.remove(req.user.id, req.params.product_id);

    res.json({ message: "Removed from wishlist", data });
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
});

/**
 * @swagger
 * tags:
 *   name: Wishlist
 *   description: Manage user wishlist
 */

/**
 * @swagger
 * /api/wishlist:
 *   post:
 *     summary: Add product to wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product_id
 *             properties:
 *               product_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Added to wishlist
 *       404:
 *         description: Product not found
 */

/**
 * @swagger
 * /api/wishlist:
 *   get:
 *     summary: Get user wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of wishlist items
 */

/**
 * @swagger
 * /api/wishlist/{product_id}:
 *   delete:
 *     summary: Remove product from wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: product_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Removed successfully
 *       404:
 *         description: Item not found
 */

module.exports = router;
