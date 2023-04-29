const getAccessTokenFromCookies = (cookieHeader) => {
  return cookieHeader
    .split(';')
    .find((cookie) => cookie.trim().startsWith('accessToken='))
    ?.split('=')[1];
};
module.exports = getAccessTokenFromCookies;
