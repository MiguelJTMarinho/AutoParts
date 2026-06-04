const repository = require("../repository/wishlistRepository");
const productRepository = require("../repository/productRepository");

// ADD
const add = async (userId, product_id) => {
  const existingProduct = await productRepository.getProductById(product_id);
  if (!existingProduct || !product_id) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  const imageUrl = existingProduct.images?.[0]?.image_url || null;

  return await repository.addToWishlist(userId, product_id, imageUrl);
};

// GET
const getMyWishlist = async (userId) => {
  return await repository.getWishlistByUser(userId);
};

// REMOVE
const remove = async (userId, product_id) => {
  const removed = await repository.removeFromWishlist(userId, product_id);

  if (!removed) {
    const error = new Error("Item not found in wishlist");
    error.statusCode = 404;
    throw error;
  }

  return removed;
};

module.exports = {
  add,
  getMyWishlist,
  remove,
};
