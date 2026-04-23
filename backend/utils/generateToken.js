// utils/generateToken.js
const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign(
    { user: { id: user.id, role: user.role } },
    process.env.JWT_SECRET,
    {
      expiresIn: "40h",
    },
  );
};

module.exports = generateToken;
