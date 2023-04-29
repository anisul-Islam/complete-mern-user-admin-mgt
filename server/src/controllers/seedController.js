// Import required modules
const data = require('../data');
const User = require('../models/userModel');
const { successResponse } = require('./responseController');

// Rename function to better describe its purpose and use camelCase for consistency
const seedUsers = async (req, res, next) => {
  try {
    // Delete all existing users
    await User.deleteMany({});

    // Create new users
    const users = await User.insertMany(data.users);

    // Return a successful response with the created users
    return successResponse(res, {
      statusCode: 201,
      message: 'Users created successfully', // Improve message readability
      payload: users,
    });
  } catch (error) {
    // Forward the error to the error handling middleware
    next(error);
  }
};

// Export the function
module.exports = { seedUsers };
