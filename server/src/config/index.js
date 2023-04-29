require('dotenv').config();

const dev = {
  db: {
    mongoURL: process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/blogDB',
  },
  app: {
    port: process.env.SERVER_PORT || 8000,
    jwtAccountActivationKey: process.env.JWT_ACCOUNT_ACTIVATION_KEY,
    jwtResetPasswordKey: process.env.JWT_RESET_PASSWORD_KEY,
    jwtAcessTokenKey: process.env.JWT_ACCESS_TOKEN_KEY,
    jwtRefreshTokenKey: process.env.JWT_REFRESH_TOKEN_KEY,
    smtpUsername: process.env.SMTP_USERNAME,
    smtpPassword: process.env.SMTP_PASSWORD,
    clientUrl: process.env.CLIENT_URL,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  },
};

module.exports = dev;
