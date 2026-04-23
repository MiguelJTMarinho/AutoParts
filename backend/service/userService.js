// userService.js
const bcrypt = require("bcryptjs");
require("dotenv").config();

const userRepository = require("../repository/userRepository");
const removePassword = require("../utils/removePassword");
const generateToken = require("../utils/generateToken");

const registerUser = async ({ firstName, lastName, email, password }) => {
  // hash password
  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(password, salt);

  const user = await userRepository.createUser({
    firstName,
    lastName,
    email,
    password_hash,
  });

  const token = generateToken(user);

  return {
    user: removePassword(user),
    token,
  };
};

const loginUser = async ({ email, password }) => {
  const user = await userRepository.findUserByEmail(email);

  if (!user) {
    throw new Error("User not found");
  }

  // MatchPassword
  const isMatch = await bcrypt.compare(password, user.password_hash);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = generateToken(user);

  return {
    user: removePassword(user),
    token,
  };
};

module.exports = {
  registerUser,
  loginUser,
};
