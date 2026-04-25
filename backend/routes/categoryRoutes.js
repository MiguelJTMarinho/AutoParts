const express = require("express");
const router = express.Router();

const categoryService = require("../service/categoryService");
const { isAdmin, protect } = require("../middleware/authMiddleware");

// @route POST /api/categories/
// @desc Create a new Category
// @acess Private (Admin)
router.post("/", protect, isAdmin, async (req, res) => {
  try {
    const category = await categoryService.createCategory(req.body);
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route GET /api/categories/
// @desc Get all categories
// @acess Public
router.get("/", async (req, res) => {
  try {
    const categories = await categoryService.getCategories();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route GET /api/categories/id
// @desc Get category by Id
// @acess Public
router.get("/:id", async (req, res) => {
  try {
    const category = await categoryService.getCategory(req.params.id);
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route PUT /api/categories/id
// @desc Update Category by Id
// @acess Private (admin)
router.put("/:id", protect, isAdmin, async (req, res) => {
  try {
    const category = await categoryService.updateCategory(
      req.params.id,
      req.body,
    );
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route DELETE /api/categories/id
// @desc Delete Category by Id
// @acess Private (admin)
router.delete("/:id", protect, isAdmin, async (req, res) => {
  try {
    await categoryService.deleteCategory(req.params.id);
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
});

module.exports = router;
