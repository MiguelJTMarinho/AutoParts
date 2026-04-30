const express = require("express");
const router = express.Router();

const service = require("../service/oemReferencesService");
const { protect, isAdmin } = require("../middleware/authMiddleware");

// CREATE
router.post("/", protect, isAdmin, async (req, res) => {
  try {
    const data = await service.createReference(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
});

// GET ALL
router.get("/", async (req, res) => {
  try {
    const data = await service.getAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET BY PRODUCT
router.get("/product/:product_id", async (req, res) => {
  try {
    const data = await service.getByProduct(req.params.product_id);
    res.json(data);
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
});

// GET BY ID
router.get("/:id", async (req, res) => {
  try {
    const data = await service.getById(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
});

// UPDATE
router.put("/:id", protect, isAdmin, async (req, res) => {
  try {
    const data = await service.update(req.params.id, req.body);
    res.json(data);
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
});

// DELETE
router.delete("/:id", protect, isAdmin, async (req, res) => {
  try {
    const data = await service.remove(req.params.id);
    res.json({ message: "Deleted successfully", data });
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
});

/**
 * @swagger
 * tags:
 *   name: OEM References
 *   description: Manage OEM and cross references for products
 */

/**
 * @swagger
 * /api/oem_references:
 *   post:
 *     summary: Create OEM reference
 *     tags: [OEM References]
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
 *               - reference_code
 *             properties:
 *               product_id:
 *                 type: integer
 *                 example: 1
 *               reference_code:
 *                 type: string
 *                 example: 1234567890
 *               type:
 *                 type: string
 *                 example: OEM
 *               brand:
 *                 type: string
 *                 example: Bosch
 *     responses:
 *       201:
 *         description: Reference created
 */

/**
 * @swagger
 * /api/oem_references:
 *   get:
 *     summary: Get all references
 *     tags: [OEM References]
 *     responses:
 *       200:
 *         description: List of references
 */

/**
 * @swagger
 * /api/oem-references/product/{product_id}:
 *   get:
 *     summary: Get references by product
 *     tags: [OEM References]
 *     parameters:
 *       - in: path
 *         name: product_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: References list
 */

/**
 * @swagger
 * /api/oem_references/{id}:
 *   get:
 *     summary: Get reference by ID
 *     tags: [OEM References]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reference data
 *       404:
 *         description: Not found
 */

/**
 * @swagger
 * /api/oem_references/{id}:
 *   put:
 *     summary: Update reference
 *     tags: [OEM References]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reference_code:
 *                 type: string
 *               type:
 *                 type: string
 *               brand:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated
 */

/**
 * @swagger
 * /api/oem_references/{id}:
 *   delete:
 *     summary: Delete reference
 *     tags: [OEM References]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Deleted
 */

module.exports = router;
