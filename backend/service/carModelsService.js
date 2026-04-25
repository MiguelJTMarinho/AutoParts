const carModelsRepository = require("../repository/carModelsRepository");
const normalizeData = require("../utils/normalizeData");

// CREATE
const createCarModel = async (data) => {
  const { carbrand_id, name } = data;

  if (!carbrand_id) {
    const error = new Error("Car brand is required");
    error.statusCode = 400;
    throw error;
  }

  if (!name || name.trim() === "") {
    const error = new Error("Car model name is required");
    error.statusCode = 400;
    throw error;
  }

  return await carModelsRepository.createCarModel({
    carbrand_id,
    name: normalizeData(name),
  });
};

// GET ALL
const getCarModels = async () => {
  return await carModelsRepository.getAllCarModels();
};

// GET BY ID
const getCarModel = async (id) => {
  return await carModelsRepository.getCarModelById(id);
};

// GET BY BRAND
const getCarModelsByBrand = async (brandId) => {
  return await carModelsRepository.getCarModelsByBrandId(brandId);
};

// UPDATE
const updateCarModel = async (id, data) => {
  const { carbrand_id, name } = data;

  if (!name || name.trim() === "") {
    const error = new Error("Car model name is required");
    error.statusCode = 400;
    throw error;
  }

  return await carModelsRepository.updateCarModel(id, {
    carbrand_id,
    name: normalizeData(name),
  });
};

// DELETE
const deleteCarModel = async (id) => {
  const deleted = await carModelsRepository.deleteCarModel(id);

  if (!deleted) {
    const error = new Error("Car model not found");
    error.statusCode = 404;
    throw error;
  }

  return deleted;
};

module.exports = {
  createCarModel,
  getCarModels,
  getCarModel,
  getCarModelsByBrand,
  updateCarModel,
  deleteCarModel,
};
