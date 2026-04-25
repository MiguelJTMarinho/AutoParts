const carBrandRepository = require("../repository/carBrandsRepository");
const normalizeData = require("../utils/normalizeData");

// CREATE
const createCarBrand = async (data) => {
  const { name } = data;

  // validation
  if (!name || name.trim() === "") {
    const error = new Error("Car brand name is required");
    error.statusCode = 400;
    throw error;
  }

  const normalizedData = {
    ...data,
    name: normalizeData(data.name),
  };

  return await carBrandRepository.createCarBrand(normalizedData);
};

// GET ALL
const getCarBrands = async () => {
  return await carBrandRepository.getAllCarBrands();
};

// GET BY ID
const getCarBrand = async (id) => {
  return await carBrandRepository.getCarBrandById(id);
};

// UPDATE
const updateCarBrand = async (id, data) => {
  const normalizedData = {
    ...data,
    name: normalizeData(data.name),
  };

  return await carBrandRepository.updateCarBrand(id, normalizedData);
};

// DELETE
const deleteCarBrand = async (id) => {
  const deleted = await carBrandRepository.deleteCarBrand(id);

  if (!deleted) {
    const error = new Error("Car brand not found");
    error.statusCode = 404;
    throw error;
  }

  return deleted;
};

module.exports = {
  createCarBrand,
  getCarBrands,
  getCarBrand,
  updateCarBrand,
  deleteCarBrand,
};
