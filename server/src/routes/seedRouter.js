const express = require('express');

const { seedUsers } = require('../controllers/seedController');

const seedRouter = express.Router();

seedRouter.get('/', seedUsers);

module.exports = seedRouter;
