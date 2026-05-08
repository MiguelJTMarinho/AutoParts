const express = require("express");
const router = express.Router();

const cartService = require("../service/cartService");
const { protect, optionalAuth } = require("../middleware/authMiddleware");

// ADD TO CART (USER OR GUEST)
router.post("/items", optionalAuth, async (req, res) => {
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

// UPDATE ITEM QUANTITY (PUT)
router.put("/items", optionalAuth, async (req, res) => {
  try {
    if (!req.body.product_id) {
      throw Object.assign(new Error("product_id is required"), {
        statusCode: 400,
      });
    }
    if (typeof req.body.quantity !== "number") {
      throw Object.assign(new Error("quantity must be a number"), {
        statusCode: 400,
      });
    }

    const data = await cartService.updateItemQuantity({
      user_id: req.user?.id || null,
      guest_id: req.headers["x-guest-id"] || null,
      product_id: req.body.product_id,
      quantity: req.body.quantity,
    });

    res.json(data);
  } catch (err) {
    res.status(err.statusCode || 500).json({
      error: err.message,
    });
  }
});

// REMOVE ITEM
router.delete("/items", optionalAuth, async (req, res) => {
  try {
    const data = await cartService.removeItem({
      user_id: req.user?.id || null,
      guest_id: req.headers["x-guest-id"] || null,
      product_id: req.body.product_id,
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
      guest_id: req.body.guest_id,
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
 * /api/cart/items:
 *   post:
 *     summary: Add product to cart (user or guest)
 *     tags: [Cart]
 *     description: Adds a product to the cart. Works with Authenticated user (JWT) or Guest user (x-guest-id header).
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
 *         description: Product added to cart successfully
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
 *     description: Returns cart contents. Requires either JWT authentication or x-guest-id header.
 *     parameters:
 *       - in: header
 *         name: x-guest-id
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
 *       400:
 *         description: Missing user or guest session
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/cart/items:
 *   put:
 *     summary: Update cart item quantity
 *     tags: [Cart]
 *     description: Updates the quantity of a product in the cart. Works for both authenticated users and guest carts.
 *     parameters:
 *       - in: header
 *         name: x-guest-id
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
 *               - quantity
 *             properties:
 *               product_id:
 *                 type: integer
 *                 example: 1
 *               quantity:
 *                 type: integer
 *                 example: 3
 *                 description: New quantity of the product in cart
 *     responses:
 *       200:
 *         description: Cart item updated successfully
 *       400:
 *         description: Invalid input (e.g., missing product_id or quantity not a number)
 *       404:
 *         description: Cart item not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/cart/items:
 *   delete:
 *     summary: Remove an item from the cart
 *     tags: [Cart]
 *     description: Removes a specific product from the cart using the product_id in the request body.
 *     parameters:
 *       - in: header
 *         name: x-guest-id
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
 *                 description: ID of the product to remove
 *     responses:
 *       200:
 *         description: Product removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Removed
 *                 data:
 *                   type: object
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Cart item not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/cart/merge:
 *   post:
 *     summary: Merge guest cart into user cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     description: Merges a guest cart into the authenticated user's cart. Combines quantities if products already exist and deletes the guest cart.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - guest_id
 *             properties:
 *               guest_id:
 *                 type: string
 *                 example: guest_17123456789
 *     responses:
 *       200:
 *         description: Cart merged successfully
 *       400:
 *         description: Guest cart empty or not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

module.exports = router;
