const jwt = require('jsonwebtoken');
const dev = require('../config');
const generateTokenAndSetCookie = (res, userId) => {
  const accessToken = jwt.sign(
    { _id: userId },
    String(dev.app.jwtAccessTokenKey),
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
  return accessToken;
};
module.exports = { generateTokenAndSetCookie };
