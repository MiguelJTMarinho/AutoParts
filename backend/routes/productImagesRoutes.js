const express = require("express");
const router = express.Router();
const multer = require("multer");
const productImagesService = require("../service/productImagesService");
const { protect, isAdmin } = require("../middleware/authMiddleware");

// Multer setup using memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// @route POST /api/product_images
// @desc Add image to product
// @access Private (Admin)
router.post("/", protect, isAdmin, async (req, res) => {
  try {
    const image = await productImagesService.addProductImage(req.body);
    res.status(201).json(image);
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
});

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

// @route DELETE /api/product_images/:id
// @desc Delete image
// @access Private (Admin)
router.delete("/:id", protect, isAdmin, async (req, res) => {
  try {
    await productImagesService.deleteProductImage(req.params.id);
    res.json({ message: "Image deleted successfully" });
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
});

// @route POST /api/product_images/upload
// @desc Upload image to Cloudinary and save URL
// @access Private (Admin)
router.post(
  "/upload",
  protect,
  isAdmin,
  upload.single("image"),
  async (req, res) => {
    try {
      const { product_id, sort_order } = req.body;

      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      if (!product_id) {
        return res.status(400).json({ error: "product_id is required" });
      }

      const image = await productImagesService.uploadAndCreate({
        fileBuffer: req.file.buffer,
        product_id,
        sort_order,
      });

      res.status(201).json(image);
    } catch (err) {
      res.status(err.statusCode || 500).json({ error: err.message });
    }
  },
);

/**
 * @swagger
 * /api/product_images/upload:
 *   post:
 *     summary: Upload image and attach to product
 *     tags: [Product Images]
 *     security:
 *       - bearerAuth: []
 *     description: Uploads an image to Cloudinary and automatically saves it in the database
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *               - product_id
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               product_id:
 *                 type: integer
 *                 example: 1
 *               sort_order:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Image uploaded and saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 product_id:
 *                   type: integer
 *                 image_url:
 *                   type: string
 *                 sort_order:
 *                   type: integer
 *       400:
 *         description: Missing file or product_id
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Upload error
 */

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

module.exports = router;
