const express = require("express");
const router = express.Router();

const service = require("../service/newsletterSubscribersService");

// @route POST /api/newsletter/subscribe
// @desc Subscribe to newsletter
// @acess Public
router.post("/subscribe", async (req, res) => {
  try {
    const data = await service.subscribe(req.body.email);
    res.status(200).json(data);
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
});

// @route POST /api/newsletter/unsubscribe
// @desc Unsubscribe from newsletter
// @acess Public
router.post("/unsubscribe", async (req, res) => {
  try {
    const data = await service.unsubscribe(req.body.email);
    res.status(200).json(data);
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
});

/**
 * @swagger
 * tags:
 *   name: Newsletter
 *   description: Newsletter subscription management
 */

/**
 * @swagger
 * /api/newsletter/subscribe:
 *   post:
 *     summary: Subscribe to newsletter
 *     tags: [Newsletter]
 *     description: Adds an email to the newsletter or reactivates it if previously unsubscribed
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
 *                 example: user@email.com
 *     responses:
 *       200:
 *         description: Subscription successful
 *       400:
 *         description: Missing email
 */

/**
 * @swagger
 * /api/newsletter/unsubscribe:
 *   post:
 *     summary: Unsubscribe from newsletter
 *     tags: [Newsletter]
 *     description: Removes an email from the newsletter
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
 *                 example: user@email.com
 *     responses:
 *       200:
 *         description: Unsubscribed successfully
 *       404:
 *         description: Email not found or already unsubscribed
 */

module.exports = router;
