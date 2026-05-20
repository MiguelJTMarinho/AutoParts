const pool = require("../config/db");

// CREATE
const createCompatibility = async ({
  product_id,
  carbrand_id,
  carmodel_id,
  year_start,
  year_end,
}) => {
  const result = await pool.query(
    `INSERT INTO product_compatibility 
     (product_id, carbrand_id, carmodel_id, year_start, year_end)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [product_id, carbrand_id, carmodel_id, year_start, year_end],
  );

  return result.rows[0];
};

const updateCompatibility = async (
  id,
  { carbrand_id, carmodel_id, year_start, year_end },
) => {
  const result = await pool.query(
    `UPDATE product_compatibility
     SET carbrand_id = $1,
         carmodel_id = $2,
         year_start = $3,
         year_end = $4
     WHERE id = $5
     RETURNING *`,
    [carbrand_id, carmodel_id, year_start, year_end, id],
  );

  return result.rows[0];
};

// GET ALL
const getAllCompatibility = async () => {
  const result = await pool.query(
    `SELECT * FROM product_compatibility ORDER BY id ASC`,
  );

  return result.rows;
};

// GET BY PRODUCT
const getByProductId = async (product_id) => {
  const result = await pool.query(
    `SELECT * FROM product_compatibility WHERE product_id = $1`,
    [product_id],
  );

  return result.rows;
};

// GET BY ID
const getById = async (id) => {
  const result = await pool.query(
    `SELECT * FROM product_compatibility WHERE id = $1`,
    [id],
  );

  return result.rows[0];
};

// DELETE
const deleteCompatibility = async (id) => {
  const result = await pool.query(
    `DELETE FROM product_compatibility WHERE id = $1 RETURNING *`,
    [id],
  );

  return result.rows[0];
};

// Get compatibility years
const getAvailableYears = async (carbrand_id, carmodel_id) => {
  const result = await pool.query(
    `
    SELECT DISTINCT generate_series(year_start, year_end) AS year
    FROM product_compatibility
    WHERE carbrand_id = $1
      AND carmodel_id = $2
      AND year_start IS NOT NULL
      AND year_end IS NOT NULL
    ORDER BY year ASC
    `,
    [carbrand_id, carmodel_id],
  );

  return result.rows.map((r) => r.year);
};

module.exports = {
  createCompatibility,
  updateCompatibility,
  getAllCompatibility,
  getByProductId,
  getById,
  deleteCompatibility,
  getAvailableYears,
};
