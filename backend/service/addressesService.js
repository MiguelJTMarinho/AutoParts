const addressesRepository = require("../repository/addressesRepository");

// CREATE
const createAddress = async (userId, data) => {
  const { title, address_line_1, country, city, postal_code } = data;

  if (!address_line_1 || !country || !city || !postal_code) {
    const error = new Error("Missing required address fields");
    error.statusCode = 400;
    throw error;
  }

  return await addressesRepository.createAddress({
    ...data,
    user_id: userId,
  });
};

// GET ALL (USER)
const getMyAddresses = async (userId) => {
  return await addressesRepository.getAddressesByUser(userId);
};

// GET ONE
const getAddress = async (userId, id) => {
  const address = await addressesRepository.getAddressById(id);

  if (!address || address.user_id !== userId) {
    const error = new Error("Address not found");
    error.statusCode = 404;
    throw error;
  }

  return address;
};

// UPDATE
const updateAddress = async (userId, id, data) => {
  const existing = await addressesRepository.getAddressById(id);

  if (!existing || existing.user_id !== userId) {
    const error = new Error("Address not found");
    error.statusCode = 404;
    throw error;
  }

  return await addressesRepository.updateAddress(id, data);
};

// DELETE
const deleteAddress = async (userId, id) => {
  const existing = await addressesRepository.getAddressById(id);

  if (!existing || existing.user_id !== userId) {
    const error = new Error("Address not found");
    error.statusCode = 404;
    throw error;
  }

  return await addressesRepository.deleteAddress(id);
};

module.exports = {
  createAddress,
  getMyAddresses,
  getAddress,
  updateAddress,
  deleteAddress,
};
