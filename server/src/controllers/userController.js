const createError = require('http-errors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const User = require('../models/userModel');
const dev = require('../config');
const { successResponse } = require('./responseController');
const { sendEmailWithNodeMailer } = require('../helpers/sendEmail');
const { default: mongoose } = require('mongoose');
const { findUserByEmail, createUser } = require('../services/userService');

// POST -> /api/users/register
// Tips : use input validation middleware
// Tips : use 422 for validation errors
// Tips : use 409 for conflict like user already exist
// Tips : when you want to return immediately use return next()
// Tips : use descriptive name like userName instead of name
const handleUserRegisterProcess = async (req, res, next) => {
  try {
    // step 1: get the data from request
    const { name, email, password, phone } = req.body;
    const image = req.file;

    // step 2: check the user already exists or not
    const userExists = await User.exists({ email: email });
    if (userExists) {
      throw createError(
        409,
        'User with this email already exists. Please sign in'
      );
    }

    // step 3: create a token for storing data temporairily
    const token = jwt.sign(
      {
        name,
        email,
        password,
        phone,
        image: image && image.path,
      },
      String(dev.app.jwtAccountActivationKey),
      { expiresIn: '10m' }
    );

    // step 4: prepare email data including jwt token
    const emailData = {
      email,
      subject: 'Account Activation Email',
      html: `
        <h2> Hello ${name}! </h2>
        <p> Please click here to <a href="${dev.app.clientUrl}/api/users/activate/${token}" target="_blank">activate your account </a> </p>
        `, // html body
    };

    // step 5: send verification email
    sendEmailWithNodeMailer(emailData);

    // step 6: send response
    return successResponse(res, {
      statusCode: 200,
      message: `Please go to your email: ${email} for completeting your registration process`,
      payload: token,
    });
  } catch (error) {
    // if it is viloating the schema error
    if (error.name === 'validationError') {
      next(createError(422, error.message));
      return;
    }
    return next(error);
  }
};

// Tips 1: instead of req.headers.authorization use req.body or req.params to get JWT token
// GET -> /api/users/activate
const handleUserAccountActivation = async (req, res, next) => {
  try {
    const token = req.body.token;

    // step 2: check token exist in request body
    if (!token) throw createError(404, 'token not found');

    // step 3: verify token and decode data
    const decoded = jwt.verify(token, String(dev.app.jwtAccountActivationKey));

    const user = await createUser(decoded);

    return successResponse(res, {
      statusCode: 201,
      message: 'user was created successfully',
    });
  } catch (error) {
    next(error);
  }
};

// GET -> isLoggedIn -> /api/users
const handleUserProfileFetch = async (req, res, next) => {
  try {
    console.log('hello');
    // step 1: get the data from the request
    const id = req.body.id;
    const options = { password: 0 };
    // step 2: check user with the email exist in db or not
    const user = await User.findById(id, options);

    if (!user)
      throw createError(
        404,
        'user does not exist with this email. please register first'
      );

    // const { password, ...rest } = Object.assign({}, user.toJSON());

    return successResponse(res, {
      statusCode: 200,
      message: 'user was returned',
      payload: user,
    });
  } catch (error) {
    if (error instanceof mongoose.Error) {
      next(createError(400, 'Invalid user id'));
      return;
    }
    next(error);
  }
};

// DELETE -> isLoggedIn -> /api/users/:id
const handleUserProfileDelete = async (req, res, next) => {
  try {
    const id = req.params.id;

    const user = await User.findOneAndDelete({ _id: id, isAdmin: false });
    if (!user) {
      throw createError(404, 'user with this id does not exist');
    }

    const userImagePath = user.image;

    fs.access(userImagePath, (err) => {
      if (err) {
        console.log('user image does not exist');
      } else {
        fs.unlink(userImagePath, (error) => {
          if (error) throw error;
          console.log('user image was deleted');
        });
      }
    });

    // reset & clear the cookies

    return successResponse(res, {
      statusCode: 200,
      message: 'user was deleted successfully',
    });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      next(createError(400, 'Invalid user id'));
    }
    next(error);
  }
};

// PUT -> isLoggedIn ->  /api/users/:id
const handleUserProfileUpdate = async (req, res, next) => {
  try {
    const userId = req.params.id;
    let updates = {};
    if (req.body.name) {
      updates.name = req.body.name;
    }
    if (req.body.phone) {
      updates.phone = req.body.phone;
    }
    if (req.body.password) {
      updates.password = req.body.password;
    }
    const image = req.file;
    if (image) {
      if (image.size > Math.pow(1024, 2))
        throw createError(
          400,
          'File too large. It must be less than 1 mb in size'
        );
      updates.image = image.path;
    }

    // Update the user's information in the database
    const updateOptions = { new: true };
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updates,
      updateOptions
    ).select('-password');

    if (!updatedUser) {
      throw createError(404, 'user with this id does not exist');
    }
    return successResponse(res, {
      statusCode: 200,
      message: 'user was upadated successfully',
      payload: updatedUser,
    });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      next(createError(400, 'Invalid user id'));
      return;
    }
    next(error);
  }
};

// for admin
// GET => isLoggedIn => isAdmin => /admin
// get all users with pagination and filtering
const getAllUsers = async (req, res, next) => {
  try {
    const search = req.query.search ? req.query.search : '';
    const { page = 1, limit = 4 } = req.query;

    const searchRegExp = new RegExp('.*' + search + '.*', 'i');
    const filter = {
      isAdmin: { $ne: true },
      $or: [
        { name: { $regex: searchRegExp } },
        { email: { $regex: searchRegExp } },
        { phone: { $regex: searchRegExp } },
      ],
    };

    const options = { password: 0 };
    const users = await User.find(filter, options)
      .limit(limit)
      .skip((page - 1) * limit);

    const count = await User.find(filter).countDocuments();

    if (!users) throw createError(404, 'no users found');

    return successResponse(res, {
      statusCode: 200,
      message: 'returned all the users who are not admin',
      payload: {
        users: users,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        previousPage: page - 1,
        nextPage: page + 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleUserRegisterProcess,
  handleUserAccountActivation,
  handleUserProfileFetch,
  handleUserProfileDelete,
  handleUserProfileUpdate,
  getAllUsers,
};
