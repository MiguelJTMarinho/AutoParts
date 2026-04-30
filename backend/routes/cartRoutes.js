const express = require("express");
const router = express.Router();

const cartService = require("../service/cartService");
const { protect } = require("../middleware/authMiddleware");

// ADD TO CART
router.post("/", protect, async (req, res) => {
  try {
    const data = await cartService.addToCart(
      req.user.id,
      req.body.product_id,
      req.body.quantity,
    );

    res.status(201).json(data);
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
});

// GET CART
router.get("/", protect, async (req, res) => {
  try {
    const data = await cartService.getCart(req.user.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE CART ITEM QTY
router.patch("/", protect, async (req, res) => {
  try {
    const { product_id, action, value } = req.body;

    const data = await cartService.updateQuantity(
      req.user.id,
      product_id,
      action,
      value,
    );

    res.json(data);
  } catch (err) {
    res.status(err.statusCode || 500).json({
      error: err.message,
    });
  }
});

// REMOVE ITEM
router.delete("/:product_id", protect, async (req, res) => {
  try {
    const data = await cartService.removeItem(
      req.user.id,
      req.params.product_id,
    );

    res.json({ message: "Removed", data });
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
});

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Shopping cart management
 */

/**
 * @swagger
 * /api/cart:
 *   post:
 *     summary: Add product to cart
 *     tags: [Cart]
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
 *               quantity:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Added to cart
 */

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get user cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart with totals
 */

/**
 * @swagger
 * /api/cart:
 *   patch:
 *     summary: Update cart item quantity
 *     tags: [Cart]
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
 *               - action
 *             properties:
 *               product_id:
 *                 type: integer
 *                 example: 1
 *               action:
 *                 type: string
 *                 enum: [increase, decrease, set]
 *                 example: increase
 *               value:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Cart updated
 *       400:
 *         description: Invalid action or stock error
 *       404:
 *         description: Item not found
 */

/**
 * @swagger
 * /api/cart/{product_id}:
 *   delete:
 *     summary: Remove item from cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: product_id
 *         required: true
 *     responses:
 *       200:
 *         description: Removed successfully
 */

module.exports = router;
