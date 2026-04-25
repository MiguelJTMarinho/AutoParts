const express = require("express");
const router = express.Router();

const partBrandsService = require("../service/partBrandsService");
const { protect, isAdmin } = require("../middleware/authMiddleware");

// @route POST /api/part-brands
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

// @route GET /api/part-brands/
// @desc Get all Part Brands
// @acess Public
router.get("/", async (req, res) => {
  try {
    const brands = await partBrandsService.getPartBrands();
    res.json(brands);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route GET /api/part-brands/:id
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

// @route PUT /api/part-brands/:id
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

// @route DELETE /api/part-brands/:id
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

module.exports = router;
