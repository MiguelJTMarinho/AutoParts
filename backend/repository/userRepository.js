// /backend/respository/userRepository.js
const pool = require("../config/db");

const createUser = async ({
  username,
  first_name,
  last_name,
  email,
  password_hash,
  role = "customer",
}) => {
  const result = await pool.query(
    `INSERT INTO users (username, first_name, last_name, email, password_hash, role)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [username, first_name, last_name, email, password_hash, role],
  );

  return result.rows[0];
};

const updateUserProfile = async (id, data) => {
  const { username, first_name, last_name, phone_number, nif } = data;

  const result = await pool.query(
    `UPDATE users
     SET username = COALESCE($1, username),
         first_name = COALESCE($2, first_name),
         last_name = COALESCE($3, last_name),
         phone_number = COALESCE($4, phone_number),
         nif = COALESCE($6, nif)
     WHERE id = $5 and is_active = true
     RETURNING id, username, first_name, last_name, phone_number, role, nif`,
    [username, first_name, last_name, phone_number, id, nif],
  );

  return result.rows[0];
};

const findUserByEmail = async (email) => {
  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1 AND is_active = true",
    [email],
  );

  return result.rows[0];
};

const findByUsername = async (username) => {
  const result = await pool.query(
    "SELECT id, username, first_name, last_name, email, role FROM users WHERE username = $1 AND is_active = true",
    [username],
  );

  return result.rows[0];
};

const findUserById = async (id) => {
  const result = await pool.query(
    "SELECT id, username, first_name, last_name, email, phone_number, role, nif, is_active FROM users WHERE id = $1 AND is_active = true",
    [id],
  );

  return result.rows[0];
};

const findUserWithPasswordById = async (id) => {
  const result = await pool.query(
    "SELECT * FROM users WHERE id = $1 AND is_active = true",
    [id],
  );

  return result.rows[0];
};

const setResetPasswordToken = async (email, token, expires) => {
  const result = await pool.query(
    `UPDATE users
     SET reset_password_token = $1,
         reset_password_expires = $2
     WHERE email = $3 AND is_active = true
     RETURNING id, email`,
    [token, expires, email],
  );

  return result.rows[0];
};

const findByResetToken = async (token) => {
  const result = await pool.query(
    `SELECT * FROM users 
     WHERE reset_password_token = $1 
       AND reset_password_expires > NOW()
       AND is_active = true`,
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
     WHERE id = $2 AND is_active = true
     RETURNING id, email`,
    [password_hash, id],
  );

  return result.rows[0];
};

const getAllUsers = async () => {
  const result = await pool.query(
    `SELECT id, username, first_name, last_name, email, phone_number, role, nif, is_active
     FROM users
     WHERE is_active = true`,
  );

  return result.rows;
};

const updateUser = async (id, data) => {
  const {
    username,
    first_name,
    last_name,
    role,
    phone_number,
    is_active,
    nif,
  } = data;
  const result = await pool.query(
    `UPDATE users
     SET username = COALESCE($1, username),
          first_name = COALESCE($2, first_name),
          last_name = COALESCE($3, last_name),
          role = COALESCE($4, role),
          phone_number = COALESCE($5, phone_number),
          is_active = COALESCE($6, is_active),
          nif = COALESCE($8, nif)
      WHERE id = $7
      RETURNING id, username, first_name, last_name, email, phone_number, role, is_active, nif`,
    [username, first_name, last_name, role, phone_number, is_active, id, nif],
  );

  return result.rows[0];
};

const deleteUser = async (id) => {
  const result = await pool.query(
    `UPDATE users
     SET is_active = false
     WHERE id = $1
     RETURNING id`,
    [id],
  );

  return result.rows[0];
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  findByUsername,
  updateUserProfile,
  setResetPasswordToken,
  findByResetToken,
  updatePassword,
  findUserWithPasswordById,
  getAllUsers,
  updateUser,
  deleteUser,
};
