const { randomBytes } = require('crypto');
exports.getRandomString = () => {
  const token = randomBytes(64).toString('hex');
  console.log(token);
};
