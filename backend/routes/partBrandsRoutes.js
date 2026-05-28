const express = require("express");
const router = express.Router();

const partBrandsService = require("../service/partBrandsService");
const { protect, isAdmin } = require("../middleware/authMiddleware");

// @route POST /api/part_brands
// @desc Create a new Part Brand
// @acess Private (Admin)
router.post("/", protect, isAdmin, async (req, res) => {
  try {
    const brand = await partBrandsService.createPartBrand(req.body);
    res.status(201).json(brand);
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({
        error: "Part brand already exists",
      });
    }

    res.status(err.statusCode || 500).json({
      error: err.message,
    });
  }
});

// @route GET /api/part_brands/
// @desc Get all Part_Brands
// @acess Public
router.get("/", async (req, res) => {
  try {
    const brands = await partBrandsService.getPartBrands();
    res.json(brands);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route GET /api/part_brands/:id
// @desc Get Part Brand by ID
// @acess Public
router.get("/:id", async (req, res) => {
  try {
    const brand = await partBrandsService.getPartBrand(req.params.id);
    res.json(brand);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route PUT /api/part_brands/:id
// @desc Update Part Brand
// @acess Private (Admin)
router.put("/:id", protect, isAdmin, async (req, res) => {
  try {
    const brand = await partBrandsService.updatePartBrand(
      req.params.id,
      req.body,
    );
    res.json(brand);
  } catch (err) {
    res.status(err.statusCode || 500).json({
      error: err.message,
    });
  }
});

// @route DELETE /api/part_brands/:id
// @desc Delete a Part Brand
// @acess Private (Admin)
router.delete("/:id", protect, isAdmin, async (req, res) => {
  try {
    await partBrandsService.deletePartBrand(req.params.id);
    res.json({ message: "Part brand deleted successfully" });
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
});

/**
 * @swagger
 * tags:
 *   name: Part Brands
 *   description: Part brand management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     PartBrand:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: Bosch
 *
 *     PartBrandInput:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           example: Valeo
 */

/**
 * @swagger
 * /api/part_brands:
 *   post:
 *     summary: Create a new Part Brand
 *     tags: [Part Brands]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PartBrandInput'
 *     responses:
 *       201:
 *         description: Part brand created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PartBrand'
 *       400:
 *         description: Invalid input (missing name)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not admin)
 *       409:
 *         description: Part brand already exists
 */

/**
 * @swagger
 * /api/part_brands:
 *   get:
 *     summary: Get all Part_Brands
 *     tags: [Part Brands]
 *     responses:
 *       200:
 *         description: List of part_brands
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PartBrand'
 */

/**
 * @swagger
 * /api/part_brands/{id}:
 *   get:
 *     summary: Get Part Brand by ID
 *     tags: [Part Brands]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Part Brand ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Part brand found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PartBrand'
 *       404:
 *         description: Part brand not found
 */

/**
 * @swagger
 * /api/part_brands/{id}:
 *   put:
 *     summary: Update a Part Brand
 *     tags: [Part Brands]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Part Brand ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PartBrandInput'
 *     responses:
 *       200:
 *         description: Part brand updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PartBrand'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not admin)
 *       404:
 *         description: Part brand not found
 */

/**
 * @swagger
 * /api/part_brands/{id}:
 *   delete:
 *     summary: Delete a Part Brand
 *     tags: [Part Brands]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Part Brand ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Part brand deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not admin)
 *       404:
 *         description: Part brand not found
 */

module.exports = router;
