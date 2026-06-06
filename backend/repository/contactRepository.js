const pool = require("../config/db");

const createMessage = async ({ name, email, subject, message }) => {
  const result = await pool.query(
    `
    INSERT INTO contact_messages
    (name, email, subject, message)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
    [name, email, subject, message],
  );

  return result.rows[0];
};

module.exports = {
  createMessage,
};
