const { body } = require('express-validator');

const validateUserRegistration = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 3, max: 31 })
    .withMessage('Name should be at least 3-31 characters long'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email address'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password should be at least 6 characters long'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('image')
    .optional()
    .isString()
    .withMessage('User image must be a string')
    .isURL()
    .withMessage('User image must be a valid URL'),
];

const validateUserLogin = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email address'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password should be at least 6 characters long'),
];
const validateToken = [
  body('token').trim().notEmpty().withMessage('token is required'),
];

module.exports = { validateUserRegistration, validateUserLogin, validateToken };
