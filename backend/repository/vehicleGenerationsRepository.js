const pool = require("../config/db");

// CREATE
const createVehicleGenerations = async ({
  carbrand_id,
  carmodel_id,
  year_start,
  year_end,
  generation_name,
}) => {
  const result = await pool.query(
    `INSERT INTO vehicle_generations 
     (carbrand_id, carmodel_id, year_start, year_end, generation_name)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [carbrand_id, carmodel_id, year_start, year_end, generation_name],
  );

  return result.rows[0];
};

const updateVehicleGenerations = async (
  id,
  { carbrand_id, carmodel_id, year_start, year_end, generation_name },
) => {
  const result = await pool.query(
    `UPDATE vehicle_generations
     SET carbrand_id = $1,
         carmodel_id = $2,
         year_start = $3,
         year_end = $4,
         generation_name = $5
     WHERE id = $6
     RETURNING *`,
    [carbrand_id, carmodel_id, year_start, year_end, generation_name, id],
  );

  return result.rows[0];
};

// GET ALL
const getAllVehicleGenerations = async () => {
  const result = await pool.query(
    `SELECT * FROM vehicle_generations ORDER BY year_start ASC`,
  );

  return result.rows;
};

// GET BY BRANDID AND MODELID
const getVehicleGenerationsByBrandAndModel = async (
  carbrand_id,
  carmodel_id,
) => {
  const result = await pool.query(
    `SELECT * FROM vehicle_generations
     WHERE carbrand_id = $1 AND carmodel_id = $2
     ORDER BY year_start ASC`,
    [carbrand_id, carmodel_id],
  );

  return result.rows;
};

// GET BY ID
const getById = async (id) => {
  const result = await pool.query(
    `SELECT * FROM vehicle_generations WHERE id = $1`,
    [id],
  );

  return result.rows[0];
};

// DELETE
const deleteVehicleGenerations = async (id) => {
  const result = await pool.query(
    `DELETE FROM vehicle_generations WHERE id = $1 RETURNING *`,
    [id],
  );

  return result.rows[0];
};

module.exports = {
  createVehicleGenerations,
  updateVehicleGenerations,
  getAllVehicleGenerations,
  getVehicleGenerationsByBrandAndModel,
  getById,
  deleteVehicleGenerations,
};
