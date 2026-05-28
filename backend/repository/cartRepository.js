const pool = require("../config/db");

// GET OR CREATE CART
const getOrCreateCart = async ({ user_id, guest_id }) => {
  let cart;
  /*onsole.log(
    "Getting or creating cart for user_id:",
    user_id,
    "guest_id:",
    guest_id,
    
  );*/

  if (user_id) {
    cart = await pool.query(
      `SELECT * FROM cart WHERE user_id = $1 AND deleted_at IS NULL`,
      [user_id],
    );
  } else {
    cart = await pool.query(
      `SELECT * FROM cart WHERE guest_id = $1 AND deleted_at IS NULL`,
      [guest_id],
    );
  }

  if (cart.rows.length > 0) return cart.rows[0];

  const created = await pool.query(
    `INSERT INTO cart (user_id, guest_id) VALUES ($1, $2) RETURNING *`,
    [user_id || null, guest_id || null],
  );

  return created.rows[0];
};

// GET CART ITEMS
const getCartItems = async (cart_id) => {
  const result = await pool.query(
    `
    SELECT 
      ci.*, 
      p.name, 
      p.stock, 
      p.price,
      c.name AS category,
      
      -- Vai buscar a primeira imagem do produto (baseado no sort_order)
      (
        SELECT pi.image_url
        FROM product_images pi
        WHERE pi.product_id = p.id
        ORDER BY pi.sort_order ASC
        LIMIT 1
      ) AS image,

      -- Vai buscar a primeira marca de carro compatível (make)
      (
        SELECT cb.name
        FROM product_fitments pf
        JOIN vehicle_generations vg ON vg.id = pf.generation_id
        JOIN car_brands cb ON cb.id = vg.carbrand_id
        WHERE pf.product_id = p.id
        LIMIT 1
      ) AS make,

      -- Vai buscar o primeiro modelo de carro compatível
      (
        SELECT cm.name
        FROM product_fitments pf
        JOIN vehicle_generations vg ON vg.id = pf.generation_id
        JOIN car_models cm ON cm.id = vg.carmodel_id
        WHERE pf.product_id = p.id
        LIMIT 1
      ) AS model

    FROM cart_items ci
    JOIN products p ON p.id = ci.product_id
    LEFT JOIN categories c ON c.id = p.category_id
    WHERE ci.cart_id = $1 AND ci.deleted_at IS NULL
    `,
    [cart_id],
  );

  return result.rows;
};

// FIND ITEM
const findItem = async (cart_id, product_id) => {
  const result = await pool.query(
    `
    SELECT * FROM cart_items
    WHERE cart_id = $1 AND product_id = $2 AND deleted_at IS NULL
    `,
    [cart_id, product_id],
  );

  return result.rows[0];
};

// ADD ITEM
const addItem = async (cart_id, product_id, quantity, price) => {
  const result = await pool.query(
    `
    INSERT INTO cart_items (cart_id, product_id, quantity, price_at_time)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
    [cart_id, product_id, quantity, price],
  );

  return result.rows[0];
};

// UPDATE QUANTITY (set absoluto)
const setQuantity = async (id, quantity) => {
  const result = await pool.query(
    `
    UPDATE cart_items
    SET quantity = $1
    WHERE id = $2
    RETURNING *
    `,
    [quantity, id],
  );

  return result.rows[0];
};

// INCREMENT
const increment = async (id, amount) => {
  const result = await pool.query(
    `
    UPDATE cart_items
    SET quantity = quantity + $1
    WHERE id = $2
    RETURNING *
    `,
    [amount, id],
  );

  return result.rows[0];
};

// DECREMENT
const decrement = async (id, amount) => {
  const result = await pool.query(
    `
    UPDATE cart_items
    SET quantity = quantity - $1
    WHERE id = $2
    RETURNING *
    `,
    [amount, id],
  );

  return result.rows[0];
};

// REMOVE ITEM
const removeItem = async (cart_id, product_id) => {
  const result = await pool.query(
    `
    UPDATE cart_items
    SET deleted_at = NOW()
    WHERE cart_id = $1 AND product_id = $2
    RETURNING *
    `,
    [cart_id, product_id],
  );

  if (!result.rows.length) return null;

  return {
    success: true,
    removed_item: result.rows[0],
  };
};

//CLEAR CART (SOFT DELETE ALL ITEMS)
const clearCart = async (cart_id) => {
  const result = await pool.query(
    `UPDATE cart_items SET deleted_at = NOW() WHERE cart_id = $1`,
    [cart_id],
  );

  return result.rows[0];
};

//Delelte items and cart
const deleteCartandItems = async (cart_id) => {
  await pool.query(`DELETE FROM cart_items WHERE cart_id = $1`, [cart_id]);

  await pool.query(`DELETE FROM cart WHERE id = $1`, [cart_id]);
};

const mergeGuestIntoUserCart = async (guest_id, user_id) => {
  return await pool.query(
    `
    WITH guest_cart AS (
      SELECT * FROM cart
      WHERE guest_id = $1 AND deleted_at IS NULL
    ),
    user_cart AS (
      SELECT * FROM cart
      WHERE user_id = $2 AND deleted_at IS NULL
    )

    -- 1. If both exist, merge items
    INSERT INTO cart_items (cart_id, product_id, quantity, price_at_time)
    SELECT
      uc.id,
      gi.product_id,
      gi.quantity,
      gi.price_at_time
    FROM cart_items gi
    JOIN guest_cart gc ON gc.id = gi.cart_id
    JOIN user_cart uc ON true
    WHERE gi.deleted_at IS NULL

    ON CONFLICT (cart_id, product_id)
    DO UPDATE SET
      quantity = cart_items.quantity + EXCLUDED.quantity;

    `,
    [guest_id, user_id],
  );
};

module.exports = {
  getOrCreateCart,
  getCartItems,
  findItem,
  addItem,
  setQuantity,
  increment,
  decrement,
  removeItem,
  clearCart,
  mergeGuestIntoUserCart,
  deleteCartandItems,
};
