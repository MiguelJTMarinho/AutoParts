const express = require("express");
const router = express.Router();

const cartService = require("../service/cartService");
const { protect, optionalAuth } = require("../middleware/authMiddleware");

// ADD TO CART (USER OR GUEST)
router.post("/", async (req, res) => {
  try {
    const data = await cartService.addToCart({
      user_id: req.user?.id || null,
      guest_id: req.headers["x-guest-id"] || null,
      product_id: req.body.product_id,
      quantity: req.body.quantity || 1,
    });

    res.status(201).json(data);
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
});

// GET CART (USER OR GUEST)
router.get("/", optionalAuth, async (req, res) => {
  try {
    const data = await cartService.getCart({
      user_id: req.user?.id || null,
      guest_id: req.headers["x-guest-id"] || null,
    });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE CART ITEM
router.patch("/", optionalAuth, async (req, res) => {
  try {
    const data = await cartService.updateQuantity({
      user_id: req.user?.id || null,
      guest_id: req.headers["x-guest-id"] || null,
      product_id: req.body.product_id,
      action: req.body.action,
      value: req.body.value,
    });

    res.json(data);
  } catch (err) {
    res.status(err.statusCode || 500).json({
      error: err.message,
    });
  }
});

// REMOVE ITEM
router.delete("/:product_id", optionalAuth, async (req, res) => {
  try {
    const data = await cartService.removeItem({
      user_id: req.user?.id || null,
      guest_id: req.headers["x-guest-id"] || null,
      product_id: req.params.product_id,
    });

    res.json({ message: "Removed", data });
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
});

// Merge Guest Cart into User Cart
router.post("/merge", protect, async (req, res) => {
  try {
    const data = await cartService.mergeCart({
      guest_id: req.body.guestId,
      user_id: req.user.id,
    });

    res.json(data);
  } catch (err) {
    res.status(err.statusCode || 500).json({
      error: err.message,
    });
  }
});

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Shopping cart management (supports guest and authenticated users)
 */

/**
 * @swagger
 * /api/cart:
 *   post:
 *     summary: Add product to cart (user or guest)
 *     tags: [Cart]
 *     description: Adds a product to the cart. Works for authenticated users or guests using guest_id header.
 *     parameters:
 *       - in: header
 *         name: x-guest-id
 *         required: false
 *         schema:
 *           type: string
 *         description: Guest session ID (required for guest users)
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
 *         description: Product added to cart
 *       400:
 *         description: Invalid request or insufficient stock
 *       404:
 *         description: Product not found
 */

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get current cart (user or guest)
 *     tags: [Cart]
 *     description: Returns cart contents for authenticated user or guest session
 *     parameters:
 *       - in: header
 *         name: x-guest-id
 *         required: false
 *         schema:
 *           type: string
 *         description: Guest session ID (required if not logged in)
 *     responses:
 *       200:
 *         description: Cart retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cart_id:
 *                   type: integer
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       product_id:
 *                         type: integer
 *                       quantity:
 *                         type: integer
 *                       price_at_time:
 *                         type: number
 *                       subtotal:
 *                         type: number
 *                 total:
 *                   type: number
 *       400:
 *         description: Missing user or guest session
 */

/**
 * @swagger
 * /api/cart:
 *   patch:
 *     summary: Update cart item quantity
 *     tags: [Cart]
 *     description: Update quantity of a product in cart (increase, decrease or set value)
 *     parameters:
 *       - in: header
 *         name: x-guest-id
 *         required: false
 *         schema:
 *           type: string
 *         description: Guest session ID
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
 *                 example: 1
 *     responses:
 *       200:
 *         description: Cart updated successfully
 *       400:
 *         description: Invalid action or stock limit exceeded
 *       404:
 *         description: Cart item not found
 */

/**
 * @swagger
 * /api/cart/{product_id}:
 *   delete:
 *     summary: Remove item from cart
 *     tags: [Cart]
 *     description: Removes a product from the cart (user or guest)
 *     parameters:
 *       - in: path
 *         name: product_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID to remove
 *       - in: header
 *         name: x-guest-id
 *         required: false
 *         schema:
 *           type: string
 *         description: Guest session ID
 *     responses:
 *       200:
 *         description: Item removed successfully
 *       404:
 *         description: Item not found
 */
/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Shopping cart management (supports guest and authenticated users)
 */

/**
 * @swagger
 * /api/cart:
 *   post:
 *     summary: Add product to cart (user or guest)
 *     tags: [Cart]
 *     description: |
 *       Adds a product to the cart.
 *       Works with:
 *       - Authenticated user (JWT)
 *       - Guest user (x-guest-id header)
 *     parameters:
 *       - in: header
 *         name: x-guest-id
 *         schema:
 *           type: string
 *         description: Guest session ID (required if not authenticated)
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
 *                 default: 1
 *                 example: 2
 *     responses:
 *       201:
 *         description: Product added to cart
 *       400:
 *         description: Invalid request or insufficient stock
 *       404:
 *         description: Product not found
 */

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get current cart (user or guest)
 *     tags: [Cart]
 *     description: |
 *       Returns cart contents.
 *       Requires either:
 *       - JWT authentication
 *       - x-guest-id header
 *     parameters:
 *       - in: header
 *         name: x-guest-id
 *         schema:
 *           type: string
 *         description: Guest session ID
 *     responses:
 *       200:
 *         description: Cart retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cart_id:
 *                   type: integer
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       product_id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       quantity:
 *                         type: integer
 *                       price_at_time:
 *                         type: number
 *                       subtotal:
 *                         type: number
 *                 total:
 *                   type: number
 */

/**
 * @swagger
 * /api/cart:
 *   patch:
 *     summary: Update cart item quantity
 *     tags: [Cart]
 *     description: |
 *       Update quantity of a product in cart.
 *       Actions:
 *       - increase
 *       - decrease
 *       - set
 *     parameters:
 *       - in: header
 *         name: x-guest-id
 *         schema:
 *           type: string
 *         description: Guest session ID
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
 *                 example: 1
 *     responses:
 *       200:
 *         description: Cart updated successfully
 *       400:
 *         description: Invalid action or stock exceeded
 *       404:
 *         description: Item not found
 */

/**
 * @swagger
 * /api/cart/{product_id}:
 *   delete:
 *     summary: Remove item from cart
 *     tags: [Cart]
 *     description: Removes a product from the cart (user or guest)
 *     parameters:
 *       - in: path
 *         name: product_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *       - in: header
 *         name: x-guest-id
 *         schema:
 *           type: string
 *         description: Guest session ID
 *     responses:
 *       200:
 *         description: Item removed successfully
 *       404:
 *         description: Item not found
 */

/**
 * @swagger
 * /api/cart/merge:
 *   post:
 *     summary: Merge guest cart into user cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Merges a guest cart into the authenticated user's cart.
 *       - Combines quantities if products already exist
 *       - Deletes guest cart after merge
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - guestId
 *             properties:
 *               guestId:
 *                 type: string
 *                 example: guest_17123456789
 *     responses:
 *       200:
 *         description: Cart merged successfully
 *       400:
 *         description: Guest cart empty or not found
 *       401:
 *         description: Unauthorized
 */

module.exports = router;
