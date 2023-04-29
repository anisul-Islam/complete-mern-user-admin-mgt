const createError = require('http-errors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const User = require('../models/userModel');
const dev = require('../config');
const { successResponse } = require('./responseController');
const getAccessTokenFromCookies = require('../helpers/getAccessTokenFromCookies');

// POST -> /api/auth/login -> isLoggedOut
const handleUserLogin = async (req, res, next) => {
  try {
    // Step 1: Extract email and password from the request body
    const { email, password } = req.body;

    // Step 2: Check if the user with the provided email exists in the database
    const user = await User.findOne({ email });

    if (!user) {
      throw createError(
        404,
        'User does not exist with this email. Please register first'
      );
    }

    // Step 3: Compare the provided password with the stored one
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      throw createError(401, 'Email/password did not match');
    }

    if (user.isBanned) {
      throw createError(403, 'You are banned. Please contact the authority');
    }

    // create access token
    const accessToken = jwt.sign(
      { _id: user._id },
      String(dev.app.jwtAcessTokenKey),
      {
        expiresIn: '15m',
      }
    );

    // Set a cookie containing the refresh token
    res.cookie('accessToken', accessToken, {
      expires: new Date(Date.now() + 1000 * 60 * 14), // 14 minutes
      // maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      httpOnly: true,
      sameSite: 'None', // cross site allowing as we can make request from different site(server and client may be deployed in 2 places and have 2 url)
      secure: true, // https
    });

    return successResponse(res, {
      statusCode: 200,
      message: 'user signed in',
      payload: { accessToken, user },
    });
  } catch (error) {
    next(error);
  }
};

// POST -> /api/auth/logout -> isLoggedIn
const handleUserLogout = async (req, res, next) => {
  try {
    res.clearCookie('accessToken');
    return successResponse(res, {
      statusCode: 200,
      message: 'user was logged out',
    });
  } catch (error) {
    next(error);
  }
};

// GET -> /api/auth/refresh
const getRefreshToken = async (req, res, next) => {
  try {
    // check if token exists
    const cookieHeader = req.headers.cookie;
    const oldToken = getAccessTokenFromCookies(cookieHeader);
    // verify old token
    jwt.verify(oldToken, String(dev.app.jwtAcessTokenKey), (err, decoded) => {
      if (err) {
        return res.status(400).send({
          success: false,
          error: 'Token expired or invalid, please login again',
        });
      } else {
        // reset the cookie
        res.clearCookie('accessToken');

        // create access token
        const accessToken = jwt.sign(
          { _id: decoded._id },
          String(dev.app.jwtAcessTokenKey),
          {
            expiresIn: '15m',
          }
        );

        // Set a cookie containing the refresh token
        res.cookie('accessToken', accessToken, {
          expires: new Date(Date.now() + 1000 * 60 * 14), // 14 minutes
          // maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          httpOnly: true,
          sameSite: 'None', // cross site allowing as we can make request from different site(server and client may be deployed in 2 places and have 2 url)
          secure: true, // https
        });
        res.send({
          accessToken: accessToken,
        });
        // next();
      }
    });
  } catch (error) {
    next(error);
  }
};

// GET /auth/authorize
const authorizeUser = async (req, res, next) => {
  try {
    return res.status(200).send({
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

// POST /auth/google-login
// use these more often
const createAccessTokenAndSetCookie = (user, res) => {
  const accessToken = jwt.sign(
    { _id: user._id },
    String(dev.app.jwtAcessTokenKey),
    {
      expiresIn: '5m',
    }
  );

  res.cookie(String(user._id), accessToken, {
    expires: new Date(Date.now() + 1000 * 60 * 4), // 4 minutes
    httpOnly: true,
    sameSite: 'None',
    secure: true,
  });

  return accessToken;
};

const handleGoogeLogin = async (req, res, next) => {
  try {
    // 1. check credential exist or not
    if (!req.body || Object.keys(req.body).length === 0) {
      throw createError(404, 'No credential found');
    }

    const credential = req.body;
    const keys = Object.keys(credential);
    const idToken = keys[0];

    // 1. create google OAuth2Client
    const client = new OAuth2Client(dev.app.googleClientId);

    // 3. verify the  credential
    const ticket = await client.verifyIdToken({
      idToken,
      audience: dev.app.googleClientId,
    });

    const { email_verified, name, email, picture } = ticket.payload;
    const exsitingUser = await User.findOne({ email });

    if (email_verified) {
      if (exsitingUser) {
        // create access token and cookie
        const accessToken = createAccessTokenAndSetCookie(exsitingUser, res);
        return successResponse(res, {
          statusCode: 200,
          message: 'user signed in',
          payload: { accessToken, exsitingUser },
        });
      } else {
        let password = email + dev.app.jwtSecretKey;
        const newUser = new User({
          name,
          email,
          password,
          phone: '12345',
          // image: picture
        });

        const userData = await newUser.save();
        if (!userData) {
          return res.status(400).send({
            message: 'user was not created with google',
          });
        }

        const accessToken = createAccessTokenAndSetCookie(userData, res);
        return successResponse(res, {
          statusCode: 200,
          message: 'user signed in',
          payload: { accessToken, exsitingUser },
        });
      }
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleUserLogin,
  handleUserLogout,
  getRefreshToken,
  authorizeUser,
  handleGoogeLogin,
};
