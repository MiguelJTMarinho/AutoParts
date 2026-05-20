const express = require("express");
const router = express.Router();

const service = require("../service/productCompatibilityService");
const { protect, isAdmin } = require("../middleware/authMiddleware");

// @route POST /api/product_compatibility
// @desc Create product compatibility
// @access Private (Admin)
router.post("/", protect, isAdmin, async (req, res) => {
  try {
    const data = await service.createCompatibility(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
});

// @route PUT /api/product_compatibility/:id
// @desc Update product compatibility
// @access Private (Admin)
router.put("/:id", protect, isAdmin, async (req, res) => {
  try {
    const data = await service.update(req.params.id, req.body);
    res.json(data);
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
});

// @route GET /api/product_compatibility
// @desc Get all compatibility
// @access Public
router.get("/", async (req, res) => {
  try {
    const data = await service.getAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route GET /api/product_compatibility/product/:product_id
// @desc Get compatibility by product
// @access Public
router.get("/product/:product_id", async (req, res) => {
  try {
    const data = await service.getByProduct(req.params.product_id);
    res.json(data);
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
});

// @route DELETE /api/product_compatibility/:id
// @desc Delete compatibility
// @access Private (Admin)
router.delete("/:id", protect, isAdmin, async (req, res) => {
  try {
    const data = await service.remove(req.params.id);
    res.json({ message: "Deleted successfully", data });
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
});

// @route GET /api/product_compatibility/years
// @desc Get Compatibility years by car model and brand
// @access Public
router.get("/years/:carbrand_id/:carmodel_id", async (req, res) => {
  try {
    const { carbrand_id, carmodel_id } = req.params;

    const data = await service.getYears(carbrand_id, carmodel_id);

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
 *   name: Product Compatibility
 *   description: Manage compatibility between products and vehicles
 */

/**
 * @swagger
 * /api/product_compatibility:
 *   post:
 *     summary: Create product compatibility
 *     tags: [Product Compatibility]
 *     security:
 *       - bearerAuth: []
 *     description: Create a relation between a product and a car model
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product_id
 *               - carbrand_id
 *               - carmodel_id
 *             properties:
 *               product_id:
 *                 type: integer
 *                 example: 1
 *               carbrand_id:
 *                 type: integer
 *                 example: 2
 *               carmodel_id:
 *                 type: integer
 *                 example: 5
 *               year_start:
 *                 type: integer
 *                 example: 2015
 *               year_end:
 *                 type: integer
 *                 example: 2020
 *     responses:
 *       201:
 *         description: Compatibility created successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Product, brand or model not found
 */

/**
 * @swagger
 * /api/product_compatibility/{id}:
 *   put:
 *     summary: Update product compatibility
 *     tags: [Product Compatibility]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Compatibility ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               carbrand_id:
 *                 type: integer
 *                 example: 1
 *               carmodel_id:
 *                 type: integer
 *                 example: 3
 *               year_start:
 *                 type: integer
 *                 example: 2010
 *               year_end:
 *                 type: integer
 *                 example: 2022
 *     responses:
 *       200:
 *         description: Updated successfully
 *       404:
 *         description: Compatibility not found
 */

/**
 * @swagger
 * /api/product_compatibility:
 *   get:
 *     summary: Get all product compatibility entries
 *     tags: [Product Compatibility]
 *     description: Returns all product-to-vehicle compatibility mappings
 *     responses:
 *       200:
 *         description: List of compatibility entries
 */

/**
 * @swagger
 * /api/product_compatibility/product/{product_id}:
 *   get:
 *     summary: Get compatibility by product
 *     tags: [Product Compatibility]
 *     parameters:
 *       - in: path
 *         name: product_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Compatibility list for product
 *       400:
 *         description: Missing product_id
 */

/**
 * @swagger
 * /api/product_compatibility/{id}:
 *   delete:
 *     summary: Delete product compatibility
 *     tags: [Product Compatibility]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Compatibility ID
 *     responses:
 *       200:
 *         description: Deleted successfully
 *       404:
 *         description: Compatibility not found
 */

module.exports = router;
