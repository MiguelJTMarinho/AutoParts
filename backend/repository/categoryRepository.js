const pool = require("../config/db");

// CREATE
const createCategory = async ({ name, description, parent_id = null }) => {
  const result = await pool.query(
    `INSERT INTO categories (name, description, parent_id)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [name, description, parent_id],
  );

  return result.rows[0];
};

// GET ALL
const getAllCategories = async () => {
  const result = await pool.query(`SELECT * FROM categories ORDER BY name ASC`);

  return result.rows;
};

// GET BY ID
const getCategoryById = async (id) => {
  const result = await pool.query(`SELECT * FROM categories WHERE id = $1`, [
    id,
  ]);

  return result.rows[0];
};

// UPDATE
const updateCategory = async (id, { name, description, parent_id }) => {
  const result = await pool.query(
    `UPDATE categories
     SET name = $1,
         description = $2,
         parent_id = $3
     WHERE id = $4
     RETURNING *`,
    [name, description, parent_id, id],
  );

  return result.rows[0];
};

// DELETE
const deleteCategory = async (id) => {
  const result = await pool.query(
    `DELETE FROM categories WHERE id = $1 RETURNING *`,
    [id],
  );

  return result.rows[0]; // will be undefined if nothing deleted
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
