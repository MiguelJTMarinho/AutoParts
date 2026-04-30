const pool = require("../config/db");

// CREATE
const createReference = async (data) => {
  const { product_id, reference_code, type, brand } = data;

  const result = await pool.query(
    `INSERT INTO oem_references (product_id, reference_code, type, brand)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [product_id, reference_code, type, brand],
  );

  return result.rows[0];
};

// GET ALL
const getAllReferences = async () => {
  const result = await pool.query(
    `SELECT * FROM oem_references ORDER BY id ASC`,
  );

  return result.rows;
};

// GET BY PRODUCT
const getByProduct = async (product_id) => {
  const result = await pool.query(
    `SELECT * FROM oem_references WHERE product_id = $1`,
    [product_id],
  );

  return result.rows;
};

// GET BY ID
const getById = async (id) => {
  const result = await pool.query(
    `SELECT * FROM oem_references WHERE id = $1`,
    [id],
  );

  return result.rows[0];
};

// UPDATE
const updateReference = async (id, data) => {
  const { reference_code, type, brand } = data;

  const result = await pool.query(
    `UPDATE oem_references
     SET reference_code = COALESCE($1, reference_code),
         type = COALESCE($2, type),
         brand = COALESCE($3, brand)
     WHERE id = $4
     RETURNING *`,
    [reference_code, type, brand, id],
  );

  return result.rows[0];
};

// DELETE
const deleteReference = async (id) => {
  const result = await pool.query(
    `DELETE FROM oem_references WHERE id = $1 RETURNING *`,
    [id],
  );

  return result.rows[0];
};

module.exports = {
  createReference,
  getAllReferences,
  getByProduct,
  getById,
  updateReference,
  deleteReference,
};
