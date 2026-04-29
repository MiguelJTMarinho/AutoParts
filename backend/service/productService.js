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
const getProducts = async () => {
  return await productRepository.getAllProducts();
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

// UPDATE
const updateProduct = async (id, data) => {
  const product = await productRepository.getProductById(id);

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  return await productRepository.updateProduct(id, data);
};

// DELETE
const deleteProduct = async (id) => {
  const product = await productRepository.getProductById(id);

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  return await productRepository.deleteProduct(id);
};

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};
