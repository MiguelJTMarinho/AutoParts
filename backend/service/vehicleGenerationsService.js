const vehicleGenRepository = require("../repository/vehicleGenerationsRepository");
const carBrandRepo = require("../repository/carBrandsRepository");
const carModelRepo = require("../repository/carModelsRepository");

// CREATE
const create = async (data) => {
  const { carbrand_id, carmodel_id, year_start, year_end, generation_name } =
    data;

  if (!carbrand_id || !carmodel_id) {
    const error = new Error("carbrand_id and carmodel_id are required");
    error.statusCode = 400;
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

  if (model.carbrand_id !== Number(carbrand_id)) {
    const error = new Error("Car model does not belong to selected brand");
    error.statusCode = 400;
    throw error;
  }

  return await vehicleGenRepository.createVehicleGenerations(data);
};

// UPDATE
const update = async (id, data) => {
  const existing = await vehicleGenRepository.getById(id);

  if (!existing) {
    const error = new Error("Vehicle generation not found");
    error.statusCode = 404;
    throw error;
  }

  const { carbrand_id, carmodel_id, year_start, year_end, generation_name } =
    data;

  if (!carbrand_id || !carmodel_id) {
    const error = new Error("carbrand_id and carmodel_id are required");
    error.statusCode = 400;
    throw error;
  }

  const brand = await carBrandRepo.getCarBrandById(carbrand_id);

  if (!brand) {
    const error = new Error("Car brand not found");
    error.statusCode = 404;
    throw error;
  }

  const model = await carModelRepo.getCarModelById(carmodel_id);

  if (!model) {
    const error = new Error("Car model not found");
    error.statusCode = 404;
    throw error;
  }

  if (model.carbrand_id !== Number(carbrand_id)) {
    const error = new Error("Car model does not belong to selected brand");
    error.statusCode = 400;
    throw error;
  }

  return await vehicleGenRepository.updateVehicleGenerations(id, {
    carbrand_id,
    carmodel_id,
    year_start,
    year_end,
    generation_name,
  });
};

// GET ALL
const getAll = async () => {
  return await vehicleGenRepository.getAllVehicleGenerations();
};

// DELETE
const remove = async (id) => {
  const deleted = await vehicleGenRepository.deleteVehicleGenerations(id);

  if (!deleted) {
    const error = new Error("Compatibility not found");
    error.statusCode = 404;
    throw error;
  }

  return deleted;
};

const getbyModelandBrand = async (carbrand_id, carmodel_id) => {
  if (!carbrand_id || !carmodel_id) {
    const error = new Error("carbrand_id and carmodel_id are required");
    error.statusCode = 400;
    throw error;
  }

  return await vehicleGenRepository.getVehicleGenerationsByBrandAndModel(
    carbrand_id,
    carmodel_id,
  );
};

module.exports = {
  create,
  update,
  getAll,
  remove,
  getbyModelandBrand,
};
