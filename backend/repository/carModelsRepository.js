const pool = require("../config/db");

// CREATE
const createCarModel = async ({ carbrand_id, name }) => {
  const result = await pool.query(
    `INSERT INTO car_models (carbrand_id, name)
     VALUES ($1, $2)
     RETURNING *`,
    [carbrand_id, name],
  );

  return result.rows[0];
};

// GET ALL
const getAllCarModels = async () => {
  const result = await pool.query(`SELECT * FROM car_models ORDER BY id ASC`);

  return result.rows;
};

// GET BY ID
const getCarModelById = async (id) => {
  const result = await pool.query(`SELECT * FROM car_models WHERE id = $1`, [
    id,
  ]);

  return result.rows[0];
};

// GET BY BRAND (FOR DROPDOWN)
const getCarModelsByBrandId = async (carbrand_id) => {
  const result = await pool.query(
    `SELECT * FROM car_models WHERE carbrand_id = $1 ORDER BY name ASC`,
    [carbrand_id],
  );

  return result.rows;
};

// UPDATE
const updateCarModel = async (id, { carbrand_id, name }) => {
  const result = await pool.query(
    `UPDATE car_models
     SET carbrand_id = $1,
         name = $2
     WHERE id = $3
     RETURNING *`,
    [carbrand_id, name, id],
  );

  return result.rows[0];
};

// DELETE
const deleteCarModel = async (id) => {
  const result = await pool.query(
    `DELETE FROM car_models WHERE id = $1 RETURNING *`,
    [id],
  );

  return result.rows[0]; // will be undefined if nothing deleted
};

module.exports = {
  createCarModel,
  getAllCarModels,
  getCarModelById,
  getCarModelsByBrandId,
  updateCarModel,
  deleteCarModel,
};
