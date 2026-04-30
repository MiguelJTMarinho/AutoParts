const express = require("express");
const router = express.Router();

const service = require("../service/orderService");
const { protect } = require("../middleware/authMiddleware");

// CREATE ORDER FROM CART (CHECKOUT)
router.post("/checkout", protect, async (req, res) => {
  try {
    const data = await service.createOrderFromCart(req.user.id);
    res.status(201).json(data);
  } catch (err) {
    res.status(err.statusCode || 500).json({
      error: err.message,
    });
  }
});

// GET USER ORDERS
router.get("/", protect, async (req, res) => {
  try {
    const data = await service.getUserOrders(req.user.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ORDER DETAILS
router.get("/:id", protect, async (req, res) => {
  try {
    const data = await service.getOrderDetails(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order and checkout system
 */

/**
 * @swagger
 * /api/orders/checkout:
 *   post:
 *     summary: Create order from cart (checkout)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Cart empty or stock error
 */

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get user orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of orders
 */

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get order details
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Order details
 */

module.exports = router;
