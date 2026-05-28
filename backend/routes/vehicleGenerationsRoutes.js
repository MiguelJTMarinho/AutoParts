const express = require("express");
const router = express.Router();

const service = require("../service/vehicleGenerationsService");
const { protect, isAdmin } = require("../middleware/authMiddleware");

// @route POST /api/vehicle_generations
// @desc Create vehicle generation
// @access Private (Admin)
router.post("/", protect, isAdmin, async (req, res) => {
  try {
    const data = await service.create(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
});

// @route PUT /api/vehicle_generations/:id
// @desc Update vehicle generation
// @access Private (Admin)
router.put("/:id", protect, isAdmin, async (req, res) => {
  try {
    const data = await service.update(req.params.id, req.body);
    res.json(data);
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
});

// @route GET /api/vehicle_generations
// @desc Get all vehicle Generations
// @access Public
router.get("/", async (req, res) => {
  try {
    const data = await service.getAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route GET /api/vehicle_generations/years
// @desc Get Compatibility years by car model and brand
// @access Public
router.get("/years/:carbrand_id/:carmodel_id", async (req, res) => {
  try {
    const { carbrand_id, carmodel_id } = req.params;

    const data = await service.getbyModelandBrand(carbrand_id, carmodel_id);

    res.json(data);
  } catch (err) {
    res.status(err.statusCode || 500).json({
      error: err.message,
    });
  }
});

// @route DELETE /api/vehicle_generations/:id
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

/**
 * @swagger
 * tags:
 *   name: Vehicle Generations
 *   description: Manage vehicle generations by brand and model
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     VehicleGeneration:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         carbrand_id:
 *           type: integer
 *           example: 1
 *         carmodel_id:
 *           type: integer
 *           example: 5
 *         year_start:
 *           type: integer
 *           example: 2015
 *         year_end:
 *           type: integer
 *           example: 2020
 *         generation_name:
 *           type: string
 *           example: "F30"
 *
 *     VehicleGenerationInput:
 *       type: object
 *       required:
 *         - carbrand_id
 *         - carmodel_id
 *       properties:
 *         carbrand_id:
 *           type: integer
 *           example: 1
 *         carmodel_id:
 *           type: integer
 *           example: 5
 *         year_start:
 *           type: integer
 *           example: 2015
 *         year_end:
 *           type: integer
 *           example: 2020
 *         generation_name:
 *           type: string
 *           example: "F30"
 */

/**
 * @swagger
 * /api/vehicle_generations:
 *   post:
 *     summary: Create vehicle generation
 *     tags: [Vehicle Generations]
 *     security:
 *       - bearerAuth: []
 *     description: Creates a vehicle generation associated with a brand and model
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VehicleGenerationInput'
 *     responses:
 *       201:
 *         description: Vehicle generation created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VehicleGeneration'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Brand or model not found
 */

/**
 * @swagger
 * /api/vehicle_generations:
 *   get:
 *     summary: Get all vehicle generations
 *     tags: [Vehicle Generations]
 *     description: Returns all vehicle generations
 *     responses:
 *       200:
 *         description: List of vehicle generations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/VehicleGeneration'
 */

/**
 * @swagger
 * /api/vehicle_generations/years/{carbrand_id}/{carmodel_id}:
 *   get:
 *     summary: Get vehicle generation years by brand and model
 *     tags: [Vehicle Generations]
 *     description: Returns generation years for a given brand and model
 *     parameters:
 *       - in: path
 *         name: carbrand_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Car brand ID
 *
 *       - in: path
 *         name: carmodel_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Car model ID
 *
 *     responses:
 *       200:
 *         description: List of generation years
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/VehicleGeneration'
 *
 *       400:
 *         description: Missing parameters
 */

/**
 * @swagger
 * /api/vehicle_generations/{id}:
 *   put:
 *     summary: Update vehicle generation
 *     tags: [Vehicle Generations]
 *     security:
 *       - bearerAuth: []
 *     description: Updates an existing vehicle generation
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Vehicle generation ID
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VehicleGenerationInput'
 *
 *     responses:
 *       200:
 *         description: Vehicle generation updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VehicleGeneration'
 *
 *       404:
 *         description: Vehicle generation not found
 */

/**
 * @swagger
 * /api/vehicle_generations/{id}:
 *   delete:
 *     summary: Delete vehicle generation
 *     tags: [Vehicle Generations]
 *     security:
 *       - bearerAuth: []
 *     description: Deletes a vehicle generation
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Vehicle generation ID
 *
 *     responses:
 *       200:
 *         description: Vehicle generation deleted successfully
 *
 *       404:
 *         description: Vehicle generation not found
 */

module.exports = router;
