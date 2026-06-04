const pool = require("../config/db");

// ADD (ou reativar se já existir)
const addToWishlist = async (user_id, product_id, image_url) => {
  const result = await pool.query(
    `
    INSERT INTO wishlist (user_id, product_id, image_url)
    VALUES ($1, $2, $3)
    ON CONFLICT (user_id, product_id)
    DO UPDATE SET deleted_at = NULL, image_url = $3
    RETURNING *
    `,
    [user_id, product_id, image_url],
  );

  return result.rows[0];
};

// GET USER WISHLIST
const getWishlistByUser = async (user_id) => {
  const result = await pool.query(
    `
    SELECT w.*, p.name, p.price, p.sku
    FROM wishlist w
    JOIN products p ON p.id = w.product_id
    WHERE w.user_id = $1 AND w.deleted_at IS NULL
    ORDER BY w.created_at DESC
    `,
    [user_id],
  );

  return result.rows;
};

// REMOVE (soft delete)
const removeFromWishlist = async (user_id, product_id) => {
  const result = await pool.query(
    `
    UPDATE wishlist
    SET deleted_at = NOW()
    WHERE user_id = $1 AND product_id = $2 AND deleted_at IS NULL
    RETURNING *
    `,
    [user_id, product_id],
  );

  return result.rows[0];
};

module.exports = {
  addToWishlist,
  getWishlistByUser,
  removeFromWishlist,
};
