const partBrandsRepository = require("../repository/partBrandsRepository");
const normalizeData = require("../utils/normalizeData");

// CREATE
const createPartBrand = async (data) => {
  const { name } = data;

  if (!name || name.trim() === "") {
    const error = new Error("Part brand name is required");
    error.statusCode = 400;
    throw error;
  }

  return await partBrandsRepository.createPartBrand({
    name: normalizeData(name),
  });
};

// GET ALL
const getPartBrands = async () => {
  return await partBrandsRepository.getAllPartBrands();
};

// GET BY ID
const getPartBrand = async (id) => {
  return await partBrandsRepository.getPartBrandById(id);
};

// UPDATE
const updatePartBrand = async (id, data) => {
  const { name } = data;

  if (!name || name.trim() === "") {
    const error = new Error("Part brand name is required");
    error.statusCode = 400;
    throw error;
  }

  return await partBrandsRepository.updatePartBrand(id, {
    name: normalizeData(name),
  });
};

// DELETE
const deletePartBrand = async (id) => {
  const deleted = await partBrandsRepository.deletePartBrand(id);

  if (!deleted) {
    const error = new Error("Part brand not found");
    error.statusCode = 404;
    throw error;
  }

  return deleted;
};
module.exports = {
  createPartBrand,
  getPartBrands,
  getPartBrand,
  updatePartBrand,
  deletePartBrand,
};
