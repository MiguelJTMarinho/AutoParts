const pool = require("../config/db");

const createPayment = async (
  order_id,
  amount,
  provider,
  status = "pending",
) => {
  const result = await pool.query(
    `
    INSERT INTO payments (order_id, amount, provider, status)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
    [order_id, amount, provider, status],
  );

  return result.rows[0];
};

const updatePaymentStatus = async (payment_id, status) => {
  const result = await pool.query(
    `
    UPDATE payments
    SET status = $1, updated_at = NOW()
    WHERE id = $2
    RETURNING *
    `,
    [status, payment_id],
  );

  return result.rows[0];
};

module.exports = {
  createPayment,
  updatePaymentStatus,
};
