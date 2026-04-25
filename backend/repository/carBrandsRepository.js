const pool = require("../config/db");

// CREATE
const createCarBrand = async ({ name }) => {
  const result = await pool.query(
    `INSERT INTO car_brands (name)
     VALUES ($1)
     RETURNING *`,
    [name],
  );

  return result.rows[0];
};

// GET ALL
const getAllCarBrands = async () => {
  const result = await pool.query(`SELECT * FROM car_brands ORDER BY id ASC`);

  return result.rows;
};

// GET BY ID
const getCarBrandById = async (id) => {
  const result = await pool.query(`SELECT * FROM car_brands WHERE id = $1`, [
    id,
  ]);

  return result.rows[0];
};

// UPDATE
const updateCarBrand = async (id, { name }) => {
  const result = await pool.query(
    `UPDATE car_brands
     SET name = $1
     WHERE id = $2
     RETURNING *`,
    [name, id],
  );

  return result.rows[0];
};

// DELETE
const deleteCarBrand = async (id) => {
  const result = await pool.query(
    `DELETE FROM car_brands WHERE id = $1 RETURNING *`,
    [id],
  );

  return result.rows[0]; // will be undefined if nothing deleted
};

module.exports = {
  createCarBrand,
  getAllCarBrands,
  getCarBrandById,
  updateCarBrand,
  deleteCarBrand,
};
