const bcrypt = require('bcrypt');
const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'User name is required'],
      trim: true,
      minlength: [3, 'User name must be at least 3 characters'],
      maxlength: [31, 'User name maximum can be 31 characters'],
    },
    email: {
      type: String,
      required: [true, 'User email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: 'Please enter a valid email',
      },
    },
    password: {
      type: String,
      required: [true, 'User password is required'],
      minlength: [6, 'User password must be at least 6 characters'],
      set: (v) => bcrypt.hashSync(v, bcrypt.genSaltSync(10)),
    },
    image: {
      type: String,
      default:
        process.env.DEFAULT_USER_IMAGE_PATH ||
        'public/images/users/default.png',
    },
    phone: {
      type: String,
      required: [true, 'User phone is required'],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true } // will add 2 new fields - createdAt, updatedAt
);

const User = model('Users', userSchema);
module.exports = User;
