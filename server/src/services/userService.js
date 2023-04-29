const User = require('../models/userModel');
const createError = require('http-errors');

const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

const createUser = async (userData) => {
  const { name, email, password, phone, image } = userData;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw createError(400, 'A user with this email already exists');
  }

  const newUser = new User({
    name,
    email,
    password,
    phone,
    image,
  });

  const savedUser = await newUser.save();

  if (!savedUser) {
    throw createError(500, 'Unable to create user account');
  }

  return savedUser;
};

module.exports = {
  findUserByEmail,
  createUser,
};
