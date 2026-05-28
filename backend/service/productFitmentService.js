const repository = require("../repository/productFitmentRepository");

// CREATE
const create = async (data) => {
  const { product_id, generation_id } = data;

  if (!product_id) {
    const error = new Error("product_id is required");
    error.statusCode = 400;
    throw error;
  }

  if (!generation_id) {
    const error = new Error("generation_id is required");
    error.statusCode = 400;
    throw error;
  }

  return await repository.createProductFitment(product_id, generation_id);
};

// GET ALL
const getAll = async () => {
  return await repository.getAllProductFitments();
};

// GET BY PRODUCT
const getByProduct = async (product_id) => {
  return await repository.getFitmentsByProduct(product_id);
};

// DELETE
const remove = async (product_id, generation_id) => {
  const fitment = await repository.deleteProductFitment(
    product_id,
    generation_id,
  );

  if (!fitment) {
    const error = new Error("Fitment not found");
    error.statusCode = 404;
    throw error;
  }

  return fitment;
};

const deleteFitmentsByProduct = async (product_id) => {
  return await repository.deleteFitmentsByProduct(product_id);
};

const bulkCreateFitments = async (product_id, generation_ids) => {
  return await repository.bulkCreateFitments(product_id, generation_ids);
};

module.exports = {
  create,
  getAll,
  getByProduct,
  remove,
  deleteFitmentsByProduct,
  bulkCreateFitments,
};
