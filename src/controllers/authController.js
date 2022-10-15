import { User } from '../models/userModel.js';
import { ApiError } from '../utils/apiError.js';
import asyncHandler from 'express-async-handler';
import { fileUpload } from '../utils/uploadFile.js';
import { generateToken } from '../utils/generateToken.js';
import { sendEmail } from '../utils/sendMail.js';
import crypto from 'crypto';
import { getIp } from '../utils/get-ip.js';

// @desc    Signup
// @route   POST /api/v1/auth/signup
// @access  Public
const signUp = asyncHandler(async (req, res) => {
  let profileImage, coverImage;

  if (req.files.profileImage) {
    profileImage = await fileUpload(req.files.profileImage[0].buffer, 'users');
  }

  if (req.files.coverImage) {
    coverImage = await fileUpload(req.files.coverImage[0].buffer, 'users');
  }

  let user = new User({ ...req.body, profileImage, coverImage });
  const ip = await getIp();
  user.ip.push(ip);

  await user.save();
  const token = generateToken(user._id);

  res.status(201).json({ status: 201, data: user, token, success: true });
});

// @desc    Login
// @route   POST /api/v1/auth/login
// @access  Public
const login = asyncHandler(async (req, res, next) => {
  let user = await User.findOne({ email: req.body.email });

  if (!user || !(await user.compare(req.body.password))) {
    throw next(new ApiError('Incorrect email or password', 401));
  }

  delete user.password;
  const ip = await getIp();

  if (!user.ip.includes(ip)) {
    user.ip.push(ip);
    await user.save();
  }

  const token = generateToken(user._id);
  req.session = { jwt: token };

  res.status(200).json({ status: 200, data: user, token, success: true });
});

// @desc    Logout
// @route   POST /api/v1/auth/logout
// @access  Public
const logout = asyncHandler(async (req, res) => {
  req.session = null;
  res
    .status(200)
    .json({ status: 200, message: 'Logout Successfully', success: true });
});

// @desc    Forgot password
// @route   POST /api/v1/auth/forgotPassword
// @access  Public
const forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(
      new ApiError(`There is no user with that email ${req.body.email}`, 404)
    );
  }

  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash('sha256')
    .update(resetCode)
    .digest('hex');

  user.passwordResetCode = hashedResetCode;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // Ten Minutes Only
  user.passwordResetVerified = false;

  await user.save();

  const message = `Hi ${user.userName},\n We received a request to reset the password on your YouTube Account. \n ${resetCode} \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure.\n The YouTube Team`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset code (valid for 10 min)',
      message,
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;

    await user.save();
    return next(new ApiError('There is an error in sending email', 500));
  }

  res
    .status(200)
    .send({ status: 'Success', message: 'Reset code sent to email' });
});

// @desc    Verify password reset code
// @route   POST /api/v1/auth/verifyResetCode
// @access  Public
const verifyPassResetCode = asyncHandler(async (req, res, next) => {
  const hashedResetCode = crypto
    .createHash('sha256')
    .update(req.body.resetCode)
    .digest('hex');

  const user = await User.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ApiError('Reset code invalid or expired'));
  }

  user.passwordResetVerified = true;
  await user.save();

  res.status(200).send({
    status: 'Success',
  });
});

// @desc    Reset password
// @route   POST /api/v1/auth/resetPassword
// @access  Public
const resetPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(
      new ApiError(`There is no user with that email ${req.body.email}`, 404)
    );
  }

  if (!user.passwordResetVerified) {
    return next(new ApiError('Reset code not verified', 400));
  }

  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;

  await user.save();

  const token = generateToken(user._id);
  res.status(200).json({ status: 200, data: user, token, success: true });
});

export {
  signUp,
  login,
  logout,
  forgotPassword,
  verifyPassResetCode,
  resetPassword,
};
