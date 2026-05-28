// userService.js
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const userRepository = require("../repository/userRepository");
const removePassword = require("../utils/removePassword");
const generateToken = require("../utils/generateToken");

const generateUsername = async (email) => {
  let base = email
    .split("@")[0]
    .toLowerCase()
    .replace(/[^a-z0-9._]/g, "");
  if (!base) base = "user";

  let username = base;
  let counter = 0;

  while (await userRepository.findByUsername(username)) {
    counter++;
    username = `${base}${counter}`;
  }

  return username;
};

const registerUser = async ({ first_name, last_name, email, password }) => {
  // hash password
  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(password, salt);
  const username = await generateUsername(email);

  const user = await userRepository.createUser({
    username,
    first_name,
    last_name,
    email,
    password_hash,
  });

  const token = generateToken(user);

  return {
    user: removePassword(user),
    token,
  };
};

const createUserByAdmin = async ({
  first_name,
  last_name,
  email,
  password,
  role,
}) => {
  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(password, salt);
  const username = await generateUsername(email);
  const userRole = ["admin", "customer"].includes(role) ? role : "customer";

  const user = await userRepository.createUser({
    username,
    first_name,
    last_name,
    email,
    password_hash,
    role: userRole,
  });

  return removePassword(user);
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

// UPLOAD AVATAR
const uploadStream = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "avatars" },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      },
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

const uploadAvatar = async (userId, fileBuffer) => {
  const result = await uploadStream(fileBuffer);

  const existingUser = await userRepository.findUserById(userId);
  if (!existingUser) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const updatedUser = await userRepository.updateUserProfile(userId, {
    username: existingUser.username,
    first_name: existingUser.first_name,
    last_name: existingUser.last_name,
    phone_number: existingUser.phone_number,
    nif: existingUser.nif,
    avatar_url: result.secure_url,
  });

  return removePassword(updatedUser);
};

// UPDATE USER PROFILE
const updateUserProfile = async (userId, data) => {
  const { username, first_name, last_name, phone_number, nif, avatar_url } =
    data;

  const existingUser = await userRepository.findUserById(userId);

  if (!existingUser) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  if (username && username.trim() === "") {
    const error = new Error("Username cannot be empty");
    error.statusCode = 400;
    throw error;
  }

  const updatedUser = await userRepository.updateUserProfile(userId, {
    username,
    first_name,
    last_name,
    phone_number,
    nif,
    avatar_url: avatar_url !== undefined ? avatar_url : existingUser.avatar_url,
  });

  return updatedUser;
};

// FORGOT PASSWORD
const forgotPassword = async (email) => {
  const user = await userRepository.findUserByEmail(email);

  if (!user) {
    return { message: "If the email exists, a reset link was sent" };
  }

  const token = crypto.randomBytes(32).toString("hex");

  const expires = new Date(Date.now() + 1000 * 60 * 30); // 30 min

  await userRepository.setResetPasswordToken(email, token, expires);

  // Send email (Nodemailer)
  return {
    message: "Reset token generated",
    token, // DEV ONLY
  };
};

// RESET PASSWORD
const resetPassword = async ({ token, new_password }) => {
  const user = await userRepository.findByResetToken(token);

  if (!user) {
    const error = new Error("Invalid or expired token");
    error.statusCode = 400;
    throw error;
  }

  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(new_password, salt);

  await userRepository.updatePassword(user.id, password_hash);

  return { message: "Password updated successfully" };
};

const changePassword = async (userId, current_password, new_password) => {
  if (!current_password || !new_password) {
    const error = new Error("current_password and new_password are required");
    error.statusCode = 400;
    throw error;
  }

  const user = await userRepository.findUserWithPasswordById(userId);

  if (!user || !user.password_hash) {
    const error = new Error("User not found or invalid");
    error.statusCode = 404;
    throw error;
  }

  const isMatch = await bcrypt.compare(current_password, user.password_hash);

  if (!isMatch) {
    const error = new Error("Current password is incorrect");
    error.statusCode = 400;
    throw error;
  }

  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(new_password, salt);

  await userRepository.updatePassword(userId, password_hash);

  return { message: "Password changed successfully" };
};

// Get all users (admin only)
const getAllUsers = async () => {
  const users = await userRepository.getAllUsers();
  if (!users) {
    const error = new Error("No users found");
    error.statusCode = 404;
    throw error;
  }
  return users;
};

const updateUser = async (id, data) => {
  const {
    username,
    first_name,
    last_name,
    role,
    phone_number,
    nif,
    is_active,
  } = data;
  const updatedUser = await userRepository.updateUser(id, {
    username,
    first_name,
    last_name,
    role,
    phone_number,
    nif,
    is_active,
  });
  return updatedUser;
};

const deleteUser = async (id) => {
  const deletedUser = await userRepository.deleteUser(id);
  return deletedUser;
};

module.exports = {
  registerUser,
  createUserByAdmin,
  loginUser,
  uploadAvatar,
  updateUserProfile,
  updateUser,
  forgotPassword,
  resetPassword,
  changePassword,
  getAllUsers,
  deleteUser,
};
