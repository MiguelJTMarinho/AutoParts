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
const getAllProducts = async (filters) => {
  let query = `SELECT * FROM products WHERE deleted_at IS NULL`;
  const values = [];
  let index = 1;

  // CATEGORY
  if (filters.category_id) {
    query += ` AND category_id = $${index++}`;
    values.push(filters.category_id);
  }

  // BRAND
  if (filters.brand_id) {
    query += ` AND brand_id = $${index++}`;
    values.push(filters.brand_id);
  }

  // PRICE RANGE
  if (filters.min_price) {
    query += ` AND price >= $${index++}`;
    values.push(filters.min_price);
  }

  if (filters.max_price) {
    query += ` AND price <= $${index++}`;
    values.push(filters.max_price);
  }

  // SEARCH (nome / sku)
  if (filters.search) {
    query += ` AND (name ILIKE $${index} OR sku ILIKE $${index})`;
    values.push(`%${filters.search}%`);
    index++;
  }

  // STOCK
  if (filters.in_stock === "true") {
    query += ` AND stock > 0`;
  }

  // SORT
  if (filters.sort_by === "price_asc") query += ` ORDER BY price ASC`;
  else if (filters.sort_by === "price_desc") query += ` ORDER BY price DESC`;
  else query += ` ORDER BY id DESC`;

  const result = await pool.query(query, values);
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

const getProductStockAndPrice = async (product_id) => {
  const result = await pool.query(
    `SELECT stock, price FROM products WHERE id = $1`,
    [product_id],
  );
  return result.rows[0];
};

const updateProductStock = async (product_id, newStock) => {
  const result = await pool.query(
    `UPDATE products SET stock = $1 WHERE id = $2 RETURNING *`,
    [newStock, product_id],
  );
  return result.rows[0];
};

const getSimilarProducts = async (productId) => {
  // 1. buscar produto base
  const productResult = await pool.query(
    `SELECT category_id, brand_id 
     FROM products 
     WHERE id = $1 AND deleted_at IS NULL`,
    [productId],
  );

  const product = productResult.rows[0];

  if (!product) return [];

  // 2. tentar pela mesma categoria primeiro
  const result = await pool.query(
    `SELECT * FROM products
     WHERE deleted_at IS NULL
     AND id != $1
     AND category_id = $2
     ORDER BY RANDOM()
     LIMIT 4`,
    [productId, product.category_id],
  );

  // 3. se não tiver 4, completa por brand
  if (result.rows.length < 4) {
    const remaining = 4 - result.rows.length;

    const fallback = await pool.query(
      `SELECT * FROM products
       WHERE deleted_at IS NULL
       AND id != $1
       AND brand_id = $2
       AND category_id != $3
       ORDER BY RANDOM()
       LIMIT $4`,
      [productId, product.brand_id, product.category_id, remaining],
    );

    return [...result.rows, ...fallback.rows].slice(0, 4);
  }

  return result.rows;
};

const getNewArrivals = async () => {
  const result = await pool.query(
    `SELECT *
     FROM products
     WHERE deleted_at IS NULL
     ORDER BY created_at DESC
     LIMIT 8`,
  );

  return result.rows;
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductStockAndPrice,
  updateProductStock,
  getSimilarProducts,
  getNewArrivals,
};
