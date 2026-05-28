const shippingRateRepository = require("../repository/shippingRateRepository");

// CREATE
const createShippingRate = async (data) => {
  const { min_weight, max_weight, price } = data;

  if (
    min_weight === undefined ||
    max_weight === undefined ||
    price === undefined
  ) {
    const error = new Error("min_weight, max_weight, and price are required");
    error.statusCode = 400;
    throw error;
  }

  if (Number(min_weight) >= Number(max_weight)) {
    const error = new Error("min_weight must be less than max_weight");
    error.statusCode = 400;
    throw error;
  }

  return await shippingRateRepository.createShippingRate(data);
};

// GET ALL
const getAllShippingRates = async () => {
  return await shippingRateRepository.getAllShippingRates();
};

// GET BY ID
const getShippingRateById = async (id) => {
  const rate = await shippingRateRepository.getShippingRateById(id);
  if (!rate) {
    const error = new Error("Shipping rate not found");
    error.statusCode = 404;
    throw error;
  }
  return rate;
};

// UPDATE
const updateShippingRate = async (id, data) => {
  const existingRate = await shippingRateRepository.getShippingRateById(id);

  if (!existingRate) {
    const error = new Error("Shipping rate not found");
    error.statusCode = 404;
    throw error;
  }

  const min =
    data.min_weight !== undefined
      ? Number(data.min_weight)
      : existingRate.min_weight;
  const max =
    data.max_weight !== undefined
      ? Number(data.max_weight)
      : existingRate.max_weight;

  if (min >= max) {
    const error = new Error("min_weight must be less than max_weight");
    error.statusCode = 400;
    throw error;
  }

  return await shippingRateRepository.updateShippingRate(id, data);
};

// DELETE
const deleteShippingRate = async (id) => {
  const existingRate = await shippingRateRepository.getShippingRateById(id);

  if (!existingRate) {
    const error = new Error("Shipping rate not found");
    error.statusCode = 404;
    throw error;
  }

  return await shippingRateRepository.deleteShippingRate(id);
};

// GET MAX PRICE
const getMaxPrice = async () => {
  return await shippingRateRepository.getMaxPrice();
};

module.exports = {
  createShippingRate,
  getAllShippingRates,
  getShippingRateById,
  updateShippingRate,
  deleteShippingRate,
  getMaxPrice,
};
