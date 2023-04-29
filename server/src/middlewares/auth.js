const jwt = require('jsonwebtoken');
const dev = require('../config');
const User = require('../models/userModel');
const createError = require('http-errors');
const getAccessTokenFromCookies = require('../helpers/getAccessTokenFromCookies');

// check if user is logged in
const isLoggedIn = (req, res, next) => {
  try {
    const cookieHeader = req.headers.cookie;
    if (cookieHeader) {
      const accessToken = getAccessTokenFromCookies(cookieHeader);
      if (!accessToken) {
        throw createError(401, 'Access token not found');
      }
      // verify login token
      const decoded = jwt.verify(accessToken, String(dev.app.jwtAcessTokenKey));
      // add id to request
      req.body.id = decoded._id;
      next();
    } else {
      throw createError(404, 'Cookies not found. Please login');
    }
  } catch (error) {
    return next(error);
  }
};

// check if user is an admin
const isAdmin = async (req, res, next) => {
  try {
    const userId = req.body.id;
    const existingUser = await User.findById(userId);
    if (!existingUser.isAdmin) {
      throw createError(403, 'User is not an admin');
    }
    next();
  } catch (error) {
    next(error);
  }
};

const isLoggedOut = (req, res, next) => {
  try {
    const cookieHeader = req.headers.cookie;
    if (cookieHeader) {
      const accessToken = getAccessTokenFromCookies(cookieHeader);
      if (accessToken) {
        throw createError(403, "Can't make this request while logged in");
      }
    } else {
      console.log('No cookies found.');
      next();
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { isLoggedIn, isLoggedOut, isAdmin };
