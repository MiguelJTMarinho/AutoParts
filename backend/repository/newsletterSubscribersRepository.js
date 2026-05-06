const pool = require("../config/db");

// FIND
const findByEmail = async (email) => {
  const result = await pool.query(
    `SELECT * FROM newsletter_subscribers WHERE email = $1`,
    [email],
  );
  return result.rows[0];
};

// Subscribe
const subscribe = async (email) => {
  const result = await pool.query(
    `
    INSERT INTO newsletter_subscribers (email, subscribed_at)
    VALUES ($1, NOW())
    RETURNING *
    `,
    [email],
  );
  return result.rows[0];
};

// REACTIVATE
const reactivate = async (email) => {
  const result = await pool.query(
    `
    UPDATE newsletter_subscribers
    SET is_active = true,
        subscribed_at = NOW(),
        unsubscribed_at = NULL
    WHERE email = $1
    RETURNING *
    `,
    [email],
  );
  return result.rows[0];
};

// UNSUBSCRIBE
const unsubscribe = async (email) => {
  const result = await pool.query(
    `
    UPDATE newsletter_subscribers
    SET is_active = false,
        subscribed_at = NULL,
        unsubscribed_at = NOW()
    WHERE email = $1
    RETURNING *
    `,
    [email],
  );
  return result.rows[0];
};

module.exports = {
  findByEmail,
  subscribe,
  reactivate,
  unsubscribe,
};
