// /backend/respository/userRepository.js
const pool = require("../config/db");

const createUser = async ({ firstName, lastName, email, password_hash }) => {
  const result = await pool.query(
    `INSERT INTO users (firstname, lastname, email, password_hash, role)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [firstName, lastName, email, password_hash, "customer"],
  );

  return result.rows[0];
};

const findUserByEmail = async (email) => {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);

  return result.rows[0];
};

const findUserById = async (id) => {
  const result = await pool.query(
    "SELECT id, firstname, lastname, email, role FROM users WHERE id = $1",
    [id],
  );

  return result.rows[0];
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
};
