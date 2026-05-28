const pool = require("../config/db");

// CREATE ORDER
const createOrder = async ({
  user_id,
  total,
  status,
  nif,
  shipping_price,
  shipping_weight,
  shipping_method,
  email,
  name,
}) => {
  const result = await pool.query(
    `
    INSERT INTO orders (user_id, total, status, nif, shipping_price, shipping_weight, shipping_method, email, name)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *
    `,
    [
      user_id,
      total,
      status,
      nif,
      shipping_price,
      shipping_weight,
      shipping_method,
      email,
      name,
    ],
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
    `UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2
    RETURNING *`,
    [status, order_id],
  );
  return result.rows[0];
};

//Get order by id
const getOrderById = async (order_id) => {
  const result = await pool.query(
    `
    SELECT * FROM orders
    WHERE id = $1`,
    [order_id],
  );

  return result.rows[0];
};

// Get all orders (for admin)
const getAllOrders = async () => {
  const result = await pool.query(
    `SELECT o.*, u.username
     FROM orders o
     JOIN users u ON u.id = o.user_id
     ORDER BY o.created_at DESC`,
  );

  return result.rows;
};

const getShippingRateByWeight = async (weight) => {
  const result = await pool.query(
    `SELECT price FROM shipping_rates 
     WHERE min_weight <= $1 AND max_weight > $1 
     LIMIT 1`,
    [weight],
  );
  return result.rows[0];
};

module.exports = {
  createOrder,
  addOrderItem,
  getOrdersByUser,
  getOrderById,
  getOrderItems,
  updateOrderStatus,
  getAllOrders,
};
