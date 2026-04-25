const pool = require("../config/db");

// CREATE
const createPartBrand = async ({ name }) => {
  const result = await pool.query(
    `INSERT INTO part_brands (name)
     VALUES ($1)
     RETURNING *`,
    [name],
  );

  return result.rows[0];
};

// GET ALL
const getAllPartBrands = async () => {
  const result = await pool.query(`SELECT * FROM part_brands ORDER BY id ASC`);

  return result.rows;
};

// GET BY ID
const getPartBrandById = async (id) => {
  const result = await pool.query(`SELECT * FROM part_brands WHERE id = $1`, [
    id,
  ]);

  return result.rows[0];
};

// UPDATE
const updatePartBrand = async (id, { name }) => {
  const result = await pool.query(
    `UPDATE part_brands
     SET name = $1
     WHERE id = $2
     RETURNING *`,
    [name, id],
  );

  return result.rows[0];
};

// DELETE
const deletePartBrand = async (id) => {
  const result = await pool.query(
    `DELETE FROM part_brands WHERE id = $1 RETURNING *`,
    [id],
  );

  return result.rows[0]; // will be undefined if nothing deleted
};

module.exports = {
  createPartBrand,
  getAllPartBrands,
  getPartBrandById,
  updatePartBrand,
  deletePartBrand,
};
