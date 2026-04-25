const categoryRepository = require("../repository/categoryRepository");

// CREATE
const createCategory = async (data) => {
  return await categoryRepository.createCategory(data);
};

// READ ALL
const getCategories = async () => {
  return await categoryRepository.getAllCategories();
};

// READ ONE
const getCategory = async (id) => {
  return await categoryRepository.getCategoryById(id);
};

// UPDATE
const updateCategory = async (id, data) => {
  return await categoryRepository.updateCategory(id, data);
};

// DELETE
const deleteCategory = async (id) => {
  const deleted = await categoryRepository.deleteCategory(id);

  if (!deleted) {
    const error = new Error("Category not found");
    error.statusCode = 404;
    throw error;
  }

  return deleted;
};
module.exports = {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
