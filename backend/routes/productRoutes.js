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
    const data = await service.getProducts(req.query);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route GET /api/products/new-arrivals
// @desc Get latest 8 products
// @access Public
router.get("/new_arrivals", async (req, res) => {
  try {
    const data = await service.getNewArrivals();
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

// @route GET /api/products/:id/similar
// @desc Get similar products
// @access Public
router.get("/similar/:id", async (req, res) => {
  try {
    const data = await service.getSimilarProducts(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
});

// @route GET /api/products/admin
// @desc Get all products for admin (including inactive/deleted)
// @access private (Admin)
router.get("/admin", protect, isAdmin, async (req, res) => {
  try {
    const data = await service.getAllProductsForAdmin();
    res.json(data);
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
 *     summary: Get all products with filters
 *     tags: [Products]
 *     description: Returns products with optional filters (category, brand, price range, search, stock, sorting)
 *     parameters:
 *       - in: query
 *         name: category_id
 *         schema:
 *           type: integer
 *         description: Filter by category ID
 *
 *       - in: query
 *         name: brand_id
 *         schema:
 *           type: integer
 *         description: Filter by brand ID
 *
 *       - in: query
 *         name: min_price
 *         schema:
 *           type: number
 *         description: Minimum price filter
 *
 *       - in: query
 *         name: max_price
 *         schema:
 *           type: number
 *         description: Maximum price filter
 *
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by product name or SKU
 *
 *       - in: query
 *         name: in_stock
 *         schema:
 *           type: boolean
 *         description: Filter only products with stock > 0
 *
 *       - in: query
 *         name: sort_by
 *         schema:
 *           type: string
 *           enum: [price_asc, price_desc, newest]
 *         description: Sorting option
 *
 *     responses:
 *       200:
 *         description: List of filtered products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   price:
 *                     type: number
 *                   stock:
 *                     type: integer
 *                   category_id:
 *                     type: integer
 *                   brand_id:
 *                     type: integer
 *       500:
 *         description: Server error
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

/**
 * @swagger
 * /api/products/similar/{prodID}:
 *   get:
 *     summary: Get similar products
 *     tags: [Products]
 *     description: Returns 4 products similar to the given product (same category, fallback to brand)
 *     parameters:
 *       - in: path
 *         name: prodID
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       200:
 *         description: List of similar products (max 4)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/products/new_arrivals:
 *   get:
 *     summary: Get latest products
 *     tags: [Products]
 *     description: Returns the 8 most recently added products
 *     responses:
 *       200:
 *         description: List of latest products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 12
 *         external_id:
 *           type: string
 *           example: "IN-1005"
 *         name:
 *           type: string
 *           example: "Shock Absorbers Volvo XC60"
 *         description:
 *           type: string
 *           example: "Front shock absorbers"
 *         summary:
 *           type: string
 *           example: "Suspension Volvo"
 *         sku:
 *           type: string
 *           example: "SH-XC60-001"
 *         price:
 *           type: string
 *           example: "180.00"
 *         condition:
 *           type: string
 *           example: "used"
 *         stock:
 *           type: integer
 *           example: 6
 *         category_id:
 *           type: integer
 *           example: 3
 *         brand_id:
 *           type: integer
 *           example: 31
 *         status:
 *           type: string
 *           example: "active"
 *         is_active:
 *           type: boolean
 *           example: true
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2026-04-30T17:54:51.037Z"
 *         updated_at:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: null
 *         deleted_at:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: null
 *
 * /api/products/admin:
 *   get:
 *     summary: Get all products for admin
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     description: Returns all products including inactive and deleted (Admin only)
 *     responses:
 *       200:
 *         description: List of all products for admin
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Not an admin)
 *       500:
 *         description: Server error
 */

module.exports = router;
