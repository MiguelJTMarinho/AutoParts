const prodCompatRepository = require("../repository/productCompatibilityRepository");
const productRepo = require("../repository/productRepository");
const carBrandRepo = require("../repository/carBrandsRepository");
const carModelRepo = require("../repository/carModelsRepository");

// CREATE
const createCompatibility = async (data) => {
  const { product_id, carbrand_id, carmodel_id, year_start, year_end } = data;

  if (!product_id || !carbrand_id || !carmodel_id) {
    const error = new Error(
      "product_id, carbrand_id and carmodel_id are required",
    );
    error.statusCode = 400;
    throw error;
  }

  // validate product
  const product =
    (await productRepo.getProductByIdForAdmin(product_id)) ||
    (await productRepo.getProductById(product_id));
  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  // validate brand
  const brand = await carBrandRepo.getCarBrandById(carbrand_id);
  if (!brand) {
    const error = new Error("Car brand not found");
    error.statusCode = 404;
    throw error;
  }

  // validate model
  const model = await carModelRepo.getCarModelById(carmodel_id);
  if (!model) {
    const error = new Error("Car model not found");
    error.statusCode = 404;
    throw error;
  }

  return await prodCompatRepository.createCompatibility(data);
};

const update = async (id, data) => {
  const existing = await prodCompatRepository.getById(id);

  if (!existing) {
    const error = new Error("Compatibility not found");
    error.statusCode = 404;
    throw error;
  }

  const { carbrand_id, carmodel_id, year_start, year_end } = data;

  if (!carbrand_id || !carmodel_id) {
    const error = new Error("carbrand_id and carmodel_id are required");
    error.statusCode = 400;
    throw error;
  }

  return await prodCompatRepository.updateCompatibility(id, {
    carbrand_id,
    carmodel_id,
    year_start,
    year_end,
  });
};

// GET ALL
const getAll = async () => {
  return await prodCompatRepository.getAllCompatibility();
};

// GET BY PRODUCT
const getByProduct = async (product_id) => {
  if (!product_id) {
    const error = new Error("product_id is required");
    error.statusCode = 400;
    throw error;
  }

  return await prodCompatRepository.getByProductId(product_id);
};

// DELETE
const remove = async (id) => {
  const deleted = await prodCompatRepository.deleteCompatibility(id);

  if (!deleted) {
    const error = new Error("Compatibility not found");
    error.statusCode = 404;
    throw error;
  }

  return deleted;
};

// Get Compatibility years
const getYears = async (carbrand_id, carmodel_id) => {
  if (!carbrand_id || !carmodel_id) {
    const error = new Error("carbrand_id and carmodel_id are required");
    error.statusCode = 400;
    throw error;
  }

  return await prodCompatRepository.getAvailableYears(carbrand_id, carmodel_id);
};

module.exports = {
  createCompatibility,
  getAll,
  getByProduct,
  remove,
  update,
  getYears,
};
