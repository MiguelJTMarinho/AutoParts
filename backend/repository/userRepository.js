// /backend/respository/userRepository.js
const pool = require("../config/db");

const createUser = async ({
  username,
  first_name,
  last_name,
  email,
  password_hash,
}) => {
  const result = await pool.query(
    `INSERT INTO users (username, first_name, last_name, email, password_hash, role)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [username, first_name, last_name, email, password_hash, "customer"],
  );

  return result.rows[0];
};

const updateUser = async (id, data) => {
  const { username, first_name, last_name, phone_number } = data;

  const result = await pool.query(
    `UPDATE users
     SET username = COALESCE($1, username),
         first_name = COALESCE($2, first_name),
         last_name = COALESCE($3, last_name),
         phone_number = COALESCE($4, phone_number)
     WHERE id = $5
     RETURNING id, username, first_name, last_name, phone_number, role`,
    [username, first_name, last_name, phone_number, id],
  );

  return result.rows[0];
};

const findUserByEmail = async (email) => {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);

  return result.rows[0];
};

const findByUsername = async (username) => {
  const result = await pool.query(
    "SELECT id, username, first_name, last_name, email, role FROM users WHERE username = $1",
    [username],
  );

  return result.rows[0];
};

const findUserById = async (id) => {
  const result = await pool.query(
    "SELECT id, username, first_name, last_name, email, phone_number, role FROM users WHERE id = $1",
    [id],
  );

  return result.rows[0];
};

const findUserWithPasswordById = async (id) => {
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);

  return result.rows[0];
};

const setResetPasswordToken = async (email, token, expires) => {
  const result = await pool.query(
    `UPDATE users
     SET reset_password_token = $1,
         reset_password_expires = $2
     WHERE email = $3
     RETURNING id, email`,
    [token, expires, email],
  );

  return result.rows[0];
};

const findByResetToken = async (token) => {
  const result = await pool.query(
    `SELECT * FROM users 
     WHERE reset_password_token = $1 
       AND reset_password_expires > NOW()`,
    [token],
  );

  return result.rows[0];
};

const updatePassword = async (id, password_hash) => {
  const result = await pool.query(
    `UPDATE users
     SET password_hash = $1,
         reset_password_token = NULL,
         reset_password_expires = NULL
     WHERE id = $2
     RETURNING id, email`,
    [password_hash, id],
  );

  return result.rows[0];
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  findByUsername,
  updateUser,
  setResetPasswordToken,
  findByResetToken,
  updatePassword,
  findUserWithPasswordById,
};
