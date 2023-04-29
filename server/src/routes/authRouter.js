const express = require('express');

const {
  getRefreshToken,
  handleUserLogin,
  handleUserLogout,
  authorizeUser,
  handleGoogeLogin,
} = require('../controllers/authController');
const { validateUserLogin } = require('../validators/auth');
const runValidation = require('../validators');
const { isLoggedIn, isAdmin, isLoggedOut } = require('../middlewares/Auth');

const authRouter = express.Router();

authRouter.post(
  '/login',
  validateUserLogin,
  runValidation,
  isLoggedOut,
  handleUserLogin
); // working fine

authRouter.post('/logout', isLoggedIn, handleUserLogout);

authRouter.get('/refresh', getRefreshToken);
authRouter.get('/authorize', authorizeUser);
authRouter.post('/google-login', handleGoogeLogin);

// check if user is logged in
authRouter.get('/check-login', isLoggedIn, getRefreshToken, authorizeUser);

// check if user is admin
authRouter.get(
  '/check-admin',
  isLoggedIn,
  isAdmin,
  getRefreshToken,
  authorizeUser
);

// get refershToken
authRouter.get('/refresh-token', isLoggedIn, isAdmin, getRefreshToken);

module.exports = authRouter;
