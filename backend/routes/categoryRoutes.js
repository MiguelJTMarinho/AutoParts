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

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management
 */

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
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
 *               description:
 *                 type: string
 *               parent_id:
 *                 type: integer
 *                 nullable: true
 *                 example: null
 *     responses:
 *       201:
 *         description: Category created successfully
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of categories
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Get category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Category ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Category data
 *       404:
 *         description: Category not found
 */

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Update category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Category ID
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
 *               description:
 *                 type: string
 *               parent_id:
 *                 type: integer
 *                 nullable: true
 *     responses:
 *       200:
 *         description: Category updated
 *       404:
 *         description: Category not found
 */

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Delete category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Category ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found
 */

module.exports = router;
