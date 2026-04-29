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
    const data = await service.getProducts();
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

module.exports = router;
