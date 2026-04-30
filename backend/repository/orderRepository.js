const pool = require("../config/db");

// CREATE ORDER
const createOrder = async (user_id, total, status = "pending") => {
  const result = await pool.query(
    `
    INSERT INTO orders (user_id, total, status)
    VALUES ($1, $2, $3)
    RETURNING *
    `,
    [user_id, total, status],
  );

  return result.rows[0];
};

// ADD ORDER ITEMS
const addOrderItem = async (order_id, product_id, quantity, price) => {
  const result = await pool.query(
    `
    INSERT INTO order_items
    (order_id, product_id, quantity, price_at_purchase)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
    [order_id, product_id, quantity, price],
  );

  return result.rows[0];
};

// GET USER ORDERS
const getOrdersByUser = async (user_id) => {
  const result = await pool.query(
    `
    SELECT * FROM orders
    WHERE user_id = $1
    ORDER BY created_at DESC
    `,
    [user_id],
  );

  return result.rows;
};

// GET ORDER ITEMS
const getOrderItems = async (order_id) => {
  const result = await pool.query(
    `
    SELECT oi.*, p.name
    FROM order_items oi
    JOIN products p ON p.id = oi.product_id
    WHERE oi.order_id = $1
    `,
    [order_id],
  );

  return result.rows;
};

//update order status (e.g. after payment)
const updateOrderStatus = async (order_id, status) => {
  const result = await pool.query(
    `UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2`,
    [status, order_id],
  );
  return result.rows[0];
};

module.exports = {
  createOrder,
  addOrderItem,
  getOrdersByUser,
  getOrderItems,
  updateOrderStatus,
};
