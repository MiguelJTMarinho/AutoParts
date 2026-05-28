const productRepository = require("../repository/productRepository");
const productFitmentRepository = require("../repository/productFitmentRepository");
const { randomUUID } = require("crypto");

// CREATE
const createProduct = async (data) => {
  const { name, price, external_id, fitments } = data;

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

  const product = await productRepository.createProduct(data);

  if (Array.isArray(fitments) && fitments.length > 0) {
    for (const generation_id of fitments) {
      await productFitmentRepository.createProductFitment(
        product.id,
        generation_id,
      );
    }
  }

  return await productRepository.getProductById(product.id);
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

  const { fitments } = data;

  await productRepository.updateProduct(id, data);

  if (Array.isArray(fitments)) {
    // apagar antigos
    await productFitmentRepository.deleteFitmentsByProduct(id);

    // recriar novos
    if (fitments.length > 0) {
      await productFitmentRepository.bulkCreateFitments(id, fitments);
    }
  }
  return await productRepository.getProductById(id);
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
