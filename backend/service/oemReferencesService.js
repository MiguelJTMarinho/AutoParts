const oemReferencesRepository = require("../repository/oemReferencesRepository");
const productRepository = require("../repository/productRepository");

// CREATE
const createReference = async (data) => {
  const { product_id, reference_code } = data;

  if (!product_id || !reference_code || reference_code.trim() === "") {
    const error = new Error("product_id and reference_code are required");
    error.statusCode = 400;
    throw error;
  }

  const product = await productRepository.getProductById(data.product_id);

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  return await oemReferencesRepository.createReference(data);
};

// GET ALL
const getAll = async () => {
  return await oemReferencesRepository.getAllReferences();
};

// GET BY PRODUCT
const getByProduct = async (product_id) => {
  if (!product_id) {
    const error = new Error("product_id is required");
    error.statusCode = 400;
    throw error;
  }

  return await oemReferencesRepository.getByProduct(product_id);
};

// GET BY ID
const getById = async (id) => {
  const ref = await oemReferencesRepository.getById(id);

  if (!ref) {
    const error = new Error("Reference not found");
    error.statusCode = 404;
    throw error;
  }

  return ref;
};

// UPDATE
const update = async (id, data) => {
  const existing = await oemReferencesRepository.getById(id);

  if (!existing) {
    const error = new Error("Reference not found");
    error.statusCode = 404;
    throw error;
  }

  return await oemReferencesRepository.updateReference(id, data);
};

// DELETE
const remove = async (id) => {
  const deleted = await oemReferencesRepository.deleteReference(id);

  if (!deleted) {
    const error = new Error("Reference not found");
    error.statusCode = 404;
    throw error;
  }

  return deleted;
};

module.exports = {
  createReference,
  getAll,
  getByProduct,
  getById,
  update,
  remove,
};
