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

module.exports = router;
