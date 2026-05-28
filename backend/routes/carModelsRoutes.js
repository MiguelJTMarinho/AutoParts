const express = require("express");
const router = express.Router();

const carModelsService = require("../service/carModelsService");
const { protect, isAdmin } = require("../middleware/authMiddleware");

// @route POST /api/car_models/
// @desc Create a new Car Model
// @acess Private (admin)
router.post("/", protect, isAdmin, async (req, res) => {
  try {
    const model = await carModelsService.createCarModel(req.body);
    res.status(201).json(model);
  } catch (err) {
    // Foreign key violation (Postgres)
    if (err.code === "23503") {
      return res.status(400).json({
        error: "Car brand does not exist",
      });
    }

    res.status(err.statusCode || 500).json({
      error: err.message,
    });
  }
});

// @route GET /api/car_models/
// @desc Get All Car Models
// @acess Public
router.get("/", async (req, res) => {
  try {
    const models = await carModelsService.getCarModels();
    res.json(models);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route GET /api/car_models/id
// @desc Get Car Model by Id
// @acess Public
router.get("/:id", async (req, res) => {
  try {
    const model = await carModelsService.getCarModel(req.params.id);
    res.json(model);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route GET /api/car_models/brandId
// @desc Get Car Model by Car BrandId (IMPORTANT FOR DROPDOWNS)
// @acess Public
router.get("/brand/:brandId", async (req, res) => {
  try {
    const models = await carModelsService.getCarModelsByBrand(
      req.params.brandId,
    );
    res.json(models);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route PUT /api/car_models/id
// @desc Update Car Model by Id
// @acess Private (admin)
router.put("/:id", protect, isAdmin, async (req, res) => {
  try {
    const model = await carModelsService.updateCarModel(
      req.params.id,
      req.body,
    );
    res.json(model);
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
});

// @route DELETE /api/car_models/id
// @desc Delete Car Model by Id
// @acess Private (admin)
router.delete("/:id", protect, isAdmin, async (req, res) => {
  try {
    await carModelsService.deleteCarModel(req.params.id);
    res.json({ message: "Car model deleted successfully" });
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
});

/**
 * @swagger
 * tags:
 *   name: Car Models
 *   description: Car models management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CarModel:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         carbrand_id:
 *           type: integer
 *         name:
 *           type: string
 *
 *     CarModelInput:
 *       type: object
 *       required:
 *         - carbrand_id
 *         - name
 *       properties:
 *         carbrand_id:
 *           type: integer
 *         name:
 *           type: string
 */

/**
 * @swagger
 * /api/car_models:
 *   post:
 *     summary: Create a new car model
 *     tags: [Car Models]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CarModelInput'
 *     responses:
 *       201:
 *         description: Car model created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CarModel'
 *       400:
 *         description: Validation error or car brand does not exist
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not admin)
 *       409:
 *         description: Duplicate car model
 */

/**
 * @swagger
 * /api/car_models:
 *   get:
 *     summary: Get all car models
 *     tags: [Car Models]
 *     responses:
 *       200:
 *         description: List of car models
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CarModel'
 */

/**
 * @swagger
 * /api/car_models/{id}:
 *   get:
 *     summary: Get car model by ID
 *     tags: [Car Models]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Car model found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CarModel'
 *       404:
 *         description: Car model not found
 */

/**
 * @swagger
 * /api/car_models/brand/{brandId}:
 *   get:
 *     summary: Get car models by car brand
 *     tags: [Car Models]
 *     parameters:
 *       - in: path
 *         name: brandId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of car models for the given brand
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CarModel'
 */

/**
 * @swagger
 * /api/car_models/{id}:
 *   put:
 *     summary: Update a car model
 *     tags: [Car Models]
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
 *             $ref: '#/components/schemas/CarModelInput'
 *     responses:
 *       200:
 *         description: Car model updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CarModel'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not admin)
 *       404:
 *         description: Car model not found
 */

/**
 * @swagger
 * /api/car_models/{id}:
 *   delete:
 *     summary: Delete a car model
 *     tags: [Car Models]
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
 *         description: Car model deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not admin)
 *       404:
 *         description: Car model not found
 */

module.exports = router;
