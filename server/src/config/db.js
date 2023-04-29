const mongoose = require('mongoose');
const dev = require('.');
const connectDatabase = async (options = {}) => {
  try {
    await mongoose.connect(dev.db.mongoURL, options);
    console.log('database is connected');

    // Tips: after the successful connection if something happend wrong
    mongoose.connection.on('error', (error) => {
      console.error('DB connection error:', error);
    });
  } catch (error) {
    console.error('Could not connect to DB:', error.toString());
  }
};

module.exports = connectDatabase;
