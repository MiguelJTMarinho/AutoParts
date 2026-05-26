const productRepository = require("../repository/productRepository");
const { randomUUID } = require("crypto");

// CREATE
const createProduct = async (data) => {
  const { name, price, external_id } = data;

  if (!name || name.trim() === "") {
    const error = new Error("Product name is required");
    error.statusCode = 400;
    throw error;
  }

  if (!external_id || external_id.trim() === "") {
    data.external_id = `IN-${randomUUID()}`;
  }

  if (!price) {
    const error = new Error("Product price is required");
    error.statusCode = 400;
    throw error;
  }

  return await productRepository.createProduct(data);
};

// GET ALL
const getProducts = async (filters) => {
  return await productRepository.getAllProducts(filters);
};

// GET BY ID
const getProduct = async (id) => {
  const product = await productRepository.getProductById(id);

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  return product;
};

const getProductForAdmin = async (id) => {
  const product = await productRepository.getProductByIdForAdmin(id);

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  return product;
};

// UPDATE
const updateProduct = async (id, data) => {
  const product = await productRepository.getProductByIdForAdmin(id);

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  return await productRepository.updateProduct(id, data);
};

// DELETE
const deleteProduct = async (id) => {
  const product = await productRepository.getProductByIdForAdmin(id);

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }
  if (product.is_active === true) {
    return await productRepository.deleteProduct(id);
  } else {
    return await productRepository.hardDeleteProduct(id);
  }
};

// GET SIMILAR PRODUCTS
const getSimilarProducts = async (productId) => {
  const products = await productRepository.getSimilarProducts(productId);

  return products;
};

//Get new arrivals
const getNewArrivals = async () => {
  return await productRepository.getNewArrivals();
};

// Get all products for admin
const getAllProductsForAdmin = async () => {
  return await productRepository.getAllProductsForAdmin();
};

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  getProductForAdmin,
  updateProduct,
  deleteProduct,
  getSimilarProducts,
  getNewArrivals,
  getAllProductsForAdmin,
};
