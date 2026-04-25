const express = require("express");
const router = express.Router();

const productImagesService = require("../service/productImagesService");

// @route POST /api/product-images
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

// @route GET /api/product-images/:productId
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

// @route DELETE /api/product-images/:id
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
