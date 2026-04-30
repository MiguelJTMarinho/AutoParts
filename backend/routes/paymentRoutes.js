const express = require("express");
const router = express.Router();

const paymentService = require("../service/paymentService");
const { protect } = require("../middleware/authMiddleware");

// CREATE PAYMENT (START CHECKOUT)
router.post("/", protect, async (req, res) => {
  try {
    const data = await paymentService.createPayment(req.body.order_id);
    res.status(201).json(data);
  } catch (err) {
    res.status(err.statusCode || 500).json({
      error: err.message,
    });
  }
});

// CONFIRM PAYMENT (PayPal success)
router.post("/confirm", protect, async (req, res) => {
  try {
    const data = await paymentService.confirmPayment(req.body.payment_id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// FAIL PAYMENT
router.post("/fail", protect, async (req, res) => {
  try {
    const data = await paymentService.failPayment(req.body.payment_id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment processing (PayPal integration)
 */

/**
 * @swagger
 * /api/payments:
 *   post:
 *     summary: Create payment for order
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - order_id
 *             properties:
 *               order_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Payment created
 */

/**
 * @swagger
 * /api/payments/confirm:
 *   post:
 *     summary: Confirm successful payment (PayPal callback)
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - payment_id
 *             properties:
 *               payment_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Payment confirmed
 */

/**
 * @swagger
 * /api/payments/fail:
 *   post:
 *     summary: Mark payment as failed
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - payment_id
 *             properties:
 *               payment_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Payment failed
 */

module.exports = router;
