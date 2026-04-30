const express = require("express");
const router = express.Router();

const service = require("../service/productService");
const { protect, isAdmin } = require("../middleware/authMiddleware");

// @route POST /api/products
// @desc Create product
// @access Private (Admin)
router.post("/", protect, isAdmin, async (req, res) => {
  try {
    const data = await service.createProduct(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
});

// @route GET /api/products
// @desc Get all products
// @access Public
router.get("/", async (req, res) => {
  try {
    const data = await service.getProducts();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route GET /api/products/:id
// @desc Get product by id
// @access Public
router.get("/:id", async (req, res) => {
  try {
    const data = await service.getProduct(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
});

// @route PUT /api/products/:id
// @desc Update product
// @access Private (Admin)
router.put("/:id", protect, isAdmin, async (req, res) => {
  try {
    const data = await service.updateProduct(req.params.id, req.body);
    res.json(data);
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
});

// @route DELETE /api/products/:id
// @desc Delete product (soft delete)
// @access Private (Admin)
router.delete("/:id", protect, isAdmin, async (req, res) => {
  try {
    const data = await service.deleteProduct(req.params.id);
    res.json({ message: "Deleted successfully", data });
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
});

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Manage products in the platform
 */

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     description: Create a product (Admin only)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *             properties:
 *               external_id:
 *                 type: string
 *                 example: ""
 *               name:
 *                 type: string
 *                 example: "Farol BMW Série 3 F30"
 *               description:
 *                 type: string
 *               summary:
 *                 type: string
 *               sku:
 *                 type: string
 *                 example: "BMW-F30-FL-001"
 *               price:
 *                 type: number
 *                 format: float
 *                 example: 120.99
 *               condition:
 *                 type: string
 *                 enum: [new, used, refurbished]
 *               stock:
 *                 type: integer
 *                 example: 5
 *               category_id:
 *                 type: integer
 *                 example: 1
 *               brand_id:
 *                 type: integer
 *                 example: 2
 *               status:
 *                 type: string
 *                 enum: [active, sold, reserved]
 *               is_active:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     description: Returns all active (non-deleted) products
 *     responses:
 *       200:
 *         description: List of products
 */

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product found
 *       404:
 *         description: Product not found
 */

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     description: Update product (Admin only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               summary:
 *                 type: string
 *               price:
 *                 type: number
 *               condition:
 *                 type: string
 *               stock:
 *                 type: integer
 *               category_id:
 *                 type: integer
 *               brand_id:
 *                 type: integer
 *               status:
 *                 type: string
 *               is_active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 */

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete product (soft delete)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     description: Marks a product as deleted (Admin only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 */

module.exports = router;
