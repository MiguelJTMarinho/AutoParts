const express = require("express");
const router = express.Router();

const carModelsService = require("../service/carModelsService");
const { protect, isAdmin } = require("../middleware/authMiddleware");

// @route POST /api/car_models/
// @desc Create a new Car Model
// @acess Private (admin)
router.post("/", async (req, res) => {
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

module.exports = router;
