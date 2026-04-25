const productImagesRepository = require("../repository/productImagesRepository");

// CREATE
const addProductImage = async (data) => {
  const { product_id, image_url } = data;

  if (!product_id || !image_url) {
    const error = new Error("product_id and image_url are required");
    error.statusCode = 400;
    throw error;
  }

  return await productImagesRepository.createProductImage(data);
};

// GET BY PRODUCT
const getProductImages = async (product_id) => {
  if (!product_id) {
    const error = new Error("product_id is required");
    error.statusCode = 400;
    throw error;
  }

  return await productImagesRepository.getImagesByProductId(product_id);
};

// DELETE
const deleteProductImage = async (id) => {
  const deleted = await productImagesRepository.deleteProductImage(id);

  if (!deleted) {
    const error = new Error("Product image not found");
    error.statusCode = 404;
    throw error;
  }

  return deleted;
};

module.exports = {
  addProductImage,
  getProductImages,
  deleteProductImage,
};
