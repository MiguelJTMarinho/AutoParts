// utils/removePassword.js
const removePassword = (user) => {
  if (!user) return user;

  const { password_hash, ...safeUser } = user;
  return safeUser;
};

module.exports = removePassword;
