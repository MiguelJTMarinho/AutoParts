const express = require("express");
const router = express.Router();

const service = require("../service/productFitmentService");

const { protect, isAdmin } = require("../middleware/authMiddleware");

// @route POST /api/product_fitments
// @desc Create product fitment
// @access Private (Admin)
router.post("/", protect, isAdmin, async (req, res) => {
  try {
    const data = await service.create(req.body);

    res.status(201).json(data);
  } catch (err) {
    res.status(err.statusCode || 500).json({
      error: err.message,
    });
  }
});

// @route GET /api/product_fitments
// @desc Get all product fitments
// @access Public
router.get("/", async (req, res) => {
  try {
    const data = await service.getAll();

    res.json(data);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// @route GET /api/product_fitments/product/:product_id
// @desc Get fitments by product
// @access Public
router.get("/product/:product_id", async (req, res) => {
  try {
    const data = await service.getByProduct(req.params.product_id);

    res.json(data);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// @route DELETE /api/product_fitments/product/:product_id
// @desc Delete all fitments by product id
// @access Private (Admin)
router.delete("/product/:product_id", protect, isAdmin, async (req, res) => {
  try {
    await service.deleteFitmentsByProduct(req.params.product_id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      error: err.message,
    });
  }
});

// @route DELETE /api/product_fitments/:product_id/:generation_id
// @desc Delete product fitment
// @access Private (Admin)
router.delete(
  "/:product_id/:generation_id",
  protect,
  isAdmin,
  async (req, res) => {
    try {
      const data = await service.remove(
        req.params.product_id,
        req.params.generation_id,
      );

      res.json({
        message: "Deleted successfully",
        data,
      });
    } catch (err) {
      res.status(err.statusCode || 500).json({
        error: err.message,
      });
    }
  },
);

/**
 * @swagger
 * tags:
 *   name: Product Fitments
 *   description: Manage product fitments with vehicle generations
 */

/**
 * @swagger
 * /api/product_fitments:
 *   post:
 *     summary: Create product fitment
 *     tags: [Product Fitments]
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
 *               - generation_id
 *             properties:
 *               product_id:
 *                 type: integer
 *                 example: 1
 *               generation_id:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       201:
 *         description: Fitment created successfully
 */

/**
 * @swagger
 * /api/product_fitments:
 *   get:
 *     summary: Get all product fitments
 *     tags: [Product Fitments]
 *     responses:
 *       200:
 *         description: List of fitments
 */

/**
 * @swagger
 * /api/product_fitments/product/{product_id}:
 *   get:
 *     summary: Get fitments by product
 *     tags: [Product Fitments]
 *     parameters:
 *       - in: path
 *         name: product_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product fitments
 */

/**
 * @swagger
 * /api/product_fitments/{product_id}/{generation_id}:
 *   delete:
 *     summary: Delete product fitment
 *     tags: [Product Fitments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: product_id
 *         required: true
 *         schema:
 *           type: integer
 *
 *       - in: path
 *         name: generation_id
 *         required: true
 *         schema:
 *           type: integer
 *
 *     responses:
 *       200:
 *         description: Fitment deleted successfully
 *       404:
 *         description: Fitment not found
 */

module.exports = router;
