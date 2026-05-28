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

// @route GET /api/products/new_arrivals
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

// @route GET /api/products/admin
// @desc Get all products for admin
// @access Private (Admin)
router.get("/admin", protect, isAdmin, async (req, res) => {
  try {
    const data = await service.getAllProductsForAdmin();
    res.json(data);
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
});

// @route GET /api/products/admin/:id
// @desc Get product by id for admin
// @access Private (Admin)
router.get("/admin/:id", protect, isAdmin, async (req, res) => {
  try {
    const data = await service.getProductForAdmin(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
});

// @route GET /api/products/similar/:id
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
// @desc Delete product
// @access Private (Admin)
router.delete("/:id", protect, isAdmin, async (req, res) => {
  try {
    const data = await service.deleteProduct(req.params.id);
    res.json({
      message: "Deleted successfully",
      data,
    });
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
 * components:
 *   schemas:
 *
 *     ProductFitment:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         vehicle_generation_id:
 *           type: integer
 *           example: 5
 *         engine:
 *           type: string
 *           example: "2.0 TDI"
 *         fuel:
 *           type: string
 *           example: "Diesel"
 *         horsepower:
 *           type: integer
 *           example: 150
 *         drivetrain:
 *           type: string
 *           example: "FWD"
 *         transmission:
 *           type: string
 *           example: "Automatic"
 *
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
 *         description:
 *           type: string
 *         summary:
 *           type: string
 *         sku:
 *           type: string
 *         price:
 *           type: number
 *           format: float
 *         condition:
 *           type: string
 *           enum: [new, used, refurbished]
 *         stock:
 *           type: integer
 *         category_id:
 *           type: integer
 *         brand_id:
 *           type: integer
 *         status:
 *           type: string
 *           enum: [active, inactive, sold, reserved]
 *         is_active:
 *           type: boolean
 *         weight_kg:
 *           type: number
 *           example: 12.5
 *         width_cm:
 *           type: number
 *           example: 40
 *         height_cm:
 *           type: number
 *           example: 25
 *         length_cm:
 *           type: number
 *           example: 60
 *         images:
 *           type: array
 *           items:
 *             type: object
 *         oem_references:
 *           type: array
 *           items:
 *             type: object
 *         compatibility:
 *           type: array
 *           items:
 *             type: object
 *         fitments:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProductFitment'
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         deleted_at:
 *           type: string
 *           format: date-time
 *           nullable: true
 *
 *     ProductInput:
 *       type: object
 *       required:
 *         - name
 *         - price
 *       properties:
 *         external_id:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         summary:
 *           type: string
 *         sku:
 *           type: string
 *         price:
 *           type: number
 *         condition:
 *           type: string
 *         stock:
 *           type: integer
 *         category_id:
 *           type: integer
 *         brand_id:
 *           type: integer
 *         status:
 *           type: string
 *         is_active:
 *           type: boolean
 *         weight_kg:
 *           type: number
 *         width_cm:
 *           type: number
 *         height_cm:
 *           type: number
 *         length_cm:
 *           type: number
 *         fitments:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProductFitment'
 */

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *
 *       - in: query
 *         name: partBrand
 *         schema:
 *           type: string
 *
 *       - in: query
 *         name: carBrand
 *         schema:
 *           type: string
 *
 *       - in: query
 *         name: carModel
 *         schema:
 *           type: string
 *
 *       - in: query
 *         name: carYear
 *         schema:
 *           type: integer
 *
 *       - in: query
 *         name: oem
 *         schema:
 *           type: string
 *
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *
 *       - in: query
 *         name: inStock
 *         schema:
 *           type: boolean
 *
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *
 *       - in: query
 *         name: sort_by
 *         schema:
 *           type: string
 *           enum: [price_asc, price_desc, newest]
 *
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
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
 *     responses:
 *       200:
 *         description: Product found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
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
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 */

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product deleted successfully
 */

/**
 * @swagger
 * /api/products/similar/{id}:
 *   get:
 *     summary: Get similar products
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Similar products list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */

/**
 * @swagger
 * /api/products/new_arrivals:
 *   get:
 *     summary: Get latest products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Latest products list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */

/**
 * @swagger
 * /api/products/admin:
 *   get:
 *     summary: Get all products for admin
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin products list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */

/**
 * @swagger
 * /api/products/admin/{id}:
 *   get:
 *     summary: Get product by ID for admin
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 */

module.exports = router;
