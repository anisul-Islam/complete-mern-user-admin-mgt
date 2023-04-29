const express = require('express');
const {
  handleUserRegisterProcess,
  handleUserAccountActivation,
  handleUserProfileUpdate,
  handleUserProfileFetch,
  handleUserProfileDelete,
  getAllUsers,
} = require('../controllers/userController');
const upload = require('../middlewares/uploadFile');
const { isAdmin, isLoggedIn } = require('../middlewares/Auth');
const runValidation = require('../validators');
const {
  validateUserRegistration,
  validateToken,
} = require('../validators/auth');

const userRouter = express.Router();

userRouter.get('/all-users', isLoggedIn, isAdmin, getAllUsers); // functional
userRouter.post(
  '/register',
  upload.single('image'),
  validateUserRegistration,
  runValidation,
  handleUserRegisterProcess
); // functional
userRouter.post(
  '/activate',
  validateToken,
  runValidation,
  handleUserAccountActivation
); // functional

userRouter.get('/profile', isLoggedIn, handleUserProfileFetch); // functional
userRouter.delete('/:id', handleUserProfileDelete); // functional
userRouter.put('/:id', upload.single('image'), handleUserProfileUpdate); // functional

userRouter.post('/forget-password', handleUserRegisterProcess);
userRouter.post('/reset-password', handleUserRegisterProcess);
userRouter.put('/update-password', handleUserRegisterProcess);

module.exports = userRouter;
