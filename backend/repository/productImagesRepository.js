const pool = require("../config/db");

// CREATE
const createProductImage = async ({
  product_id,
  image_url,
  external_uuid,
  sort_order,
}) => {
  const result = await pool.query(
    `INSERT INTO product_images (product_id, image_url, external_uuid, sort_order)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [product_id, image_url, external_uuid || null, sort_order || 0],
  );

  return result.rows[0];
};

// GET BY PRODUCT ID
const getImagesByProductId = async (product_id) => {
  const result = await pool.query(
    `SELECT * FROM product_images
     WHERE product_id = $1
     ORDER BY sort_order ASC`,
    [product_id],
  );

  return result.rows;
};

// DELETE IMAGE
const deleteProductImage = async (id) => {
  const result = await pool.query(
    `DELETE FROM product_images
     WHERE id = $1
     RETURNING *`,
    [id],
  );

  return result.rows[0];
};

module.exports = {
  createProductImage,
  getImagesByProductId,
  deleteProductImage,
};
