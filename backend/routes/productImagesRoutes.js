const express = require("express");
const router = express.Router();

const productImagesService = require("../service/productImagesService");

/**
 * @swagger
 * /api/product_images:
 *   post:
 *     summary: Add image to a product
 *     description: Creates a new product image
 *     tags: [Product Images]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_id:
 *                 type: integer
 *               image_url:
 *                 type: string
 *               sort_order:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Image created successfully
 *       400:
 *         description: Invalid input
 */

// @route POST /api/product_images
// @desc Add image to product
// @access Private (Admin)
router.post("/", async (req, res) => {
  try {
    const image = await productImagesService.addProductImage(req.body);
    res.status(201).json(image);
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/product_images/{productId}:
 *   get:
 *     summary: Get product images
 *     tags: [Product Images]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of images
 */

// @route GET /api/product_images/:productId
// @desc Get images of a product
// @access Public
router.get("/:productId", async (req, res) => {
  try {
    const images = await productImagesService.getProductImages(
      req.params.productId,
    );
    res.json(images);
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/product_images/{id}:
 *   delete:
 *     summary: Delete product image
 *     tags: [Product Images]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Deleted successfully
 *       404:
 *         description: Image not found
 */

// @route DELETE /api/product_images/:id
// @desc Delete image
// @access Private (Admin)
router.delete("/:id", async (req, res) => {
  try {
    await productImagesService.deleteProductImage(req.params.id);
    res.json({ message: "Image deleted successfully" });
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
});

module.exports = router;
