const express = require("express");
const router = express.Router();

const orderService = require("../service/orderService");
const { protect, isAdmin } = require("../middleware/authMiddleware");

// CREATE ORDER FROM CART (CHECKOUT)
router.post("/checkout", protect, async (req, res) => {
  try {
    const data = await orderService.createOrderFromCart(req.user.id);
    res.status(201).json(data);
  } catch (err) {
    res.status(err.statusCode || 500).json({
      error: err.message,
    });
  }
});

// @route GET /api/orders/admin
// @desc Get all orders (Admin only)
// @access Private/Admin
router.get("/admin", protect, isAdmin, async (req, res) => {
  try {
    const data = await orderService.getAllOrders();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET USER ORDERS
router.get("/", protect, async (req, res) => {
  try {
    const data = await orderService.getUserOrders(req.user.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ORDER DETAILS
router.get("/:id", protect, async (req, res) => {
  try {
    const data = await orderService.getOrderDetails(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE ORDER STATUS (ADMIN)
router.patch("/:id/status", protect, isAdmin, async (req, res) => {
  try {
    const data = await orderService.updateOrderStatus(
      req.params.id,
      req.body.status,
    );

    res.json({
      data: data,
      message: `Order ID ${req.params.id} status updated successfully to ${req.body.status}`,
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
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

/**
 * @swagger
 * /api/orders/{id}/status:
 *   patch:
 *     summary: Update order status (Admin)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     description: Update the status of an order (e.g. shipped, delivered)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, paid, shipped, delivered, cancelled, failed]
 *                 example: shipped
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *       400:
 *         description: Invalid status
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 */

/**
 * @swagger
 * /api/orders/admin:
 *   get:
 *     summary: Get all orders (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     description: Retrieves a comprehensive list of all orders in the store. Only accessible by administrators.
 *     responses:
 *       200:
 *         description: A list of all orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 101
 *                   user_id:
 *                     type: integer
 *                     example: 5
 *                   total:
 *                     type: string
 *                     example: "350.50"
 *                   status:
 *                     type: string
 *                     example: "processing"
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2026-05-08T10:30:00.000Z"
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 *                     nullable: true
 *                     example: null
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       403:
 *         description: Forbidden (user is not an admin)
 *       500:
 *         description: Server error
 */

module.exports = router;
