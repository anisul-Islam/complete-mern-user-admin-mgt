const { validationResult } = require('express-validator');

const runValidation = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).send({
        success: false,
        message: errors.array()[0].msg,
      });
    }

    return next();
  } catch (error) {
    return next(error);
  }
};
module.exports = runValidation;
