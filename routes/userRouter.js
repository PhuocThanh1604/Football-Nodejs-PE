const express = require('express');
const bodyParser = require("body-parser");
const userController = require('../controllers/userController')
const playersController = require('../controllers/playerController');
const userRouter = express.Router();
 const {ensureAuthenticated, jwtAuth} = require('../config/auth')
// const {redirectLogin} = require('../config/redirectLogin')

userRouter.use(bodyParser.json())
userRouter.route('/')
 .get(userController.index)
 .post(userController.regist)
 userRouter.route('/change-password')
 .get(jwtAuth,userController.changePasswordIndex)
 .post(jwtAuth,userController.changePasswordHandle)
userRouter.route('/login')
 .get(userController.login)
 .post(userController.loginJWT)
 userRouter.route('/logout')
 .get(userController.logout)
 userRouter.route('/dashboard')
  .get(jwtAuth,playersController.dashboard)
  userRouter.route('/edit')
  .get(jwtAuth,userController.formEdit)
  .post(jwtAuth,userController.edit)
  userRouter.route('/forgot-password')
  .get(userController.renderForgotPassword)
  .post(userController.forgotPassword);
  userRouter.route('/reset-password/:id')
  .get(userController.renderResetPassword)
  .post(userController.resetPassword);
  userRouter.route('/reset-password-otp/:id')
  .get(userController.renderResetPasswordOTP)
  .post(userController.resetPasswordOTP);
module.exports = userRouter;

