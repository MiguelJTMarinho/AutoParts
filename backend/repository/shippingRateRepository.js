const pool = require("../config/db");

// CREATE
const createShippingRate = async ({ min_weight, max_weight, price }) => {
  const result = await pool.query(
    `INSERT INTO shipping_rates (min_weight, max_weight, price)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [min_weight, max_weight, price],
  );
  return result.rows[0];
};

// READ ALL
const getAllShippingRates = async () => {
  const result = await pool.query(
    `SELECT * FROM shipping_rates ORDER BY min_weight ASC`,
  );
  return result.rows;
};

// READ BY ID
const getShippingRateById = async (id) => {
  const result = await pool.query(
    `SELECT * FROM shipping_rates WHERE id = $1`,
    [id],
  );
  return result.rows[0];
};

// UPDATE
const updateShippingRate = async (id, { min_weight, max_weight, price }) => {
  const result = await pool.query(
    `UPDATE shipping_rates
     SET min_weight = COALESCE($1, min_weight),
         max_weight = COALESCE($2, max_weight),
         price = COALESCE($3, price)
     WHERE id = $4
     RETURNING *`,
    [min_weight, max_weight, price, id],
  );
  return result.rows[0];
};

// DELETE (Hard Delete)
const deleteShippingRate = async (id) => {
  const result = await pool.query(
    `DELETE FROM shipping_rates WHERE id = $1 RETURNING *`,
    [id],
  );
  return result.rows[0];
};

// GET MAX PRICE
const getMaxPrice = async () => {
  const result = await pool.query(`SELECT MAX(price) FROM shipping_rates`);
  return result.rows[0];
};

module.exports = {
  createShippingRate,
  getAllShippingRates,
  getShippingRateById,
  updateShippingRate,
  deleteShippingRate,
  getMaxPrice,
};
