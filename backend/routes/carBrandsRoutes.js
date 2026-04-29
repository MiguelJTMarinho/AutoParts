const express = require("express");
const router = express.Router();

const carBrandsService = require("../service/carBrandsService");
const { protect, isAdmin } = require("../middleware/authMiddleware");

// @route POST /api/car_brands/
// @desc Create a new Car Brand
// @acess Private (admin)
router.post("/", protect, isAdmin, async (req, res) => {
  try {
    const brand = await carBrandsService.createCarBrand(req.body);
    res.status(201).json(brand);
  } catch (err) {
    // Postgres duplicate key
    if (err.code === "23505") {
      return res.status(409).json({
        error: "Car brand already exists",
      });
    }

    res.status(err.statusCode || 500).json({
      error: err.message,
    });
  }
});

// @route GET /api/car_brands/
// @desc Get all Car Brands
// @acess Public
router.get("/", async (req, res) => {
  try {
    const brands = await carBrandsService.getCarBrands();
    res.json(brands);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route GET /api/car_brands/id
// @desc Get Car Brand by Id
// @acess Public
router.get("/:id", async (req, res) => {
  try {
    const brand = await carBrandsService.getCarBrand(req.params.id);
    res.json(brand);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route PUT /api/car_brands/id
// @desc Update Car Brand by Id
// @acess Private (admin)
router.put("/:id", protect, isAdmin, async (req, res) => {
  try {
    const brand = await carBrandsService.updateCarBrand(
      req.params.id,
      req.body,
    );
    res.json(brand);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route DELETE /api/car_brands/id
// @desc Delete Car Brand by Id
// @acess Private (admin)
router.delete("/:id", protect, isAdmin, async (req, res) => {
  try {
    await carBrandsService.deleteCarBrand(req.params.id);
    res.json({ message: "Car brand deleted" });
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
});

/**
 * @swagger
 * tags:
 *   name: Car_Brands
 *   description: Car Brands management
 */

/**
 * @swagger
 * /api/car_brands:
 *   post:
 *     summary: Create a new car brand
 *     tags: [Car_Brands]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: BMW
 *     responses:
 *       201:
 *         description: Car brand created successfully
 *       400:
 *         description: Invalid input
 *       409:
 *         description: Car brand already exists
 */

/**
 * @swagger
 * /api/car_brands:
 *   get:
 *     summary: Get all car brands
 *     tags: [Car_Brands]
 *     responses:
 *       200:
 *         description: List of car brands
 */

/**
 * @swagger
 * /api/car_brands/{id}:
 *   get:
 *     summary: Get car brand by ID
 *     tags: [Car_Brands]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Car brand ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Car brand found
 *       404:
 *         description: Car brand not found
 */

/**
 * @swagger
 * /api/car_brands/{id}:
 *   put:
 *     summary: Update car brand
 *     tags: [Car_Brands]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Car brand ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Audi
 *     responses:
 *       200:
 *         description: Car brand updated successfully
 *       404:
 *         description: Car brand not found
 *       409:
 *         description: Duplicate brand
 */

/**
 * @swagger
 * /api/car_brands/{id}:
 *   delete:
 *     summary: Delete car brand
 *     tags: [Car_Brands]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Car brand ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Car brand deleted successfully
 *       404:
 *         description: Car brand not found
 */

module.exports = router;
