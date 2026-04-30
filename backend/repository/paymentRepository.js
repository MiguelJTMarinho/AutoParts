const pool = require("../config/db");

// CREATE PAYMENT
const createPayment = async (order_id, amount, provider = "paypal") => {
  const result = await pool.query(
    `
    INSERT INTO payments (order_id, amount, provider, status)
    VALUES ($1, $2, $3, 'pending')
    RETURNING *
    `,
    [order_id, amount, provider],
  );

  return result.rows[0];
};

// UPDATE STATUS
const updateStatus = async (id, status) => {
  const result = await pool.query(
    `
    UPDATE payments
    SET status = $1,
        updated_at = NOW()
    WHERE id = $2
    RETURNING *
    `,
    [status, id],
  );

  return result.rows[0];
};

// GET BY ORDER
const getPaymentByOrder = async (order_id) => {
  const result = await pool.query(
    `
    SELECT * FROM payments WHERE order_id = $1
    `,
    [order_id],
  );

  return result.rows[0];
};

module.exports = {
  createPayment,
  updateStatus,
  getPaymentByOrder,
};
