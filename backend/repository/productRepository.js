const pool = require("../config/db");

// CREATE
const createProduct = async (data) => {
  const {
    external_id,
    name,
    description,
    summary,
    sku,
    price,
    condition,
    stock,
    category_id,
    brand_id,
    status,
    is_active,
  } = data;

  const result = await pool.query(
    `INSERT INTO products (
      external_id, name, description, summary, sku,
      price, condition, stock,
      category_id, brand_id, status, is_active, created_at
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12, now())
    RETURNING *`,
    [
      external_id,
      name,
      description,
      summary,
      sku,
      price,
      condition,
      stock,
      category_id,
      brand_id,
      status,
      is_active,
    ],
  );

  return result.rows[0];
};

// GET ALL
const getAllProducts = async () => {
  const result = await pool.query(
    `SELECT * FROM products WHERE deleted_at IS NULL ORDER BY id ASC`,
  );

  return result.rows;
};

// GET BY ID
const getProductById = async (id) => {
  const result = await pool.query(
    `SELECT * FROM products WHERE id = $1 AND deleted_at IS NULL`,
    [id],
  );

  return result.rows[0];
};

// UPDATE
const updateProduct = async (id, data) => {
  const {
    name,
    description,
    summary,
    price,
    condition,
    stock,
    category_id,
    brand_id,
    status,
    is_active,
  } = data;

  const result = await pool.query(
    `UPDATE products
     SET name = $1,
         description = $2,
         summary = $3,
         price = $4,
         condition = $5,
         stock = $6,
         category_id = $7,
         brand_id = $8,
         status = $9,
         is_active = $10,
         updated_at = NOW()
     WHERE id = $11
     RETURNING *`,
    [
      name,
      description,
      summary,
      price,
      condition,
      stock,
      category_id,
      brand_id,
      status,
      is_active,
      id,
    ],
  );

  return result.rows[0];
};

// SOFT DELETE
const deleteProduct = async (id) => {
  const result = await pool.query(
    `UPDATE products SET deleted_at = NOW() WHERE id = $1 RETURNING *`,
    [id],
  );

  return result.rows[0];
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
