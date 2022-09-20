import { User } from '../models/userModel.js';
import { ApiError } from '../utils/apiError.js';
import asyncHandler from 'express-async-handler';
import { fileUpload } from '../utils/uploadFile.js';
import bcrypt from 'bcryptjs';
import { ApiFeatures } from '../utils/apiFeatures.js';

// @desc    Get Current User
// @route   GET /api/v1/users
// @access  Public
const getCurrentUser = asyncHandler(async (req, res) => {
  res.status(req.user ? 200 : 400).send({ currentUser: req.user || null });
});

// @desc    Update Current User
// @route   PUT /api/v1/users
// @access  Public
const updateUser = asyncHandler(async (req, res) => {
  let user, profileImage, coverImage;

  user = await User.findById(req.user);
  if (!user) {
    throw new ApiError('User not found', 404);
  }

  if (req.files.profileImage) {
    profileImage = await fileUpload(req.files.profileImage[0].buffer, 'users');
  }

  if (req.files.coverImage) {
    coverImage = await fileUpload(req.files.coverImage[0].buffer, 'users');
  }

  user = await User.findByIdAndUpdate(
    user,
    {
      $set: { ...req.body, profileImage, coverImage },
    },
    { new: true }
  );

  await user.save();
  res.status(200).json({
    status: 200,
    data: user,
    message: 'Updated Your Information Successfully',
    success: true,
  });
});

// @desc    Delete Current User
// @route   DELETE /api/v1/users
// @access  Public
const deleteCurrentUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.user);
  if (!user) {
    throw next(new ApiError('User Not Found', 401));
  }

  res.json({
    status: 204,
    message: 'User Deleted Successfully',
    success: true,
  });
});

// @desc    Change User Password
// @route   PATCH /api/v1/users/change-password
// @access  Public
const changeUserPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user,
    {
      password: await bcrypt.hash(req.body.newPassword, 15),
      passwordChangedAt: Date.now(),
    },
    { new: true }
  );

  if (!user) {
    throw next(new ApiError('User Not Exists', 404));
  }

  res.json({ status: 200, data: user, success: true });
});

// @desc    Get All Users Except Admins
// @route   GET /api/v1/users
// @access  Private/Admin
const allUsers = asyncHandler(async (req, res) => {
  let filter = {};
  if (req.filterObj) {
    filter = req.filterObj;
  }

  // 1) Build Query
  const documentCounts = await User.countDocuments();
  const apiFeatures = new ApiFeatures(User.find(filter), req.query)
    .paginate(documentCounts)
    .filter()
    .search('Users')
    .limitFields()
    .sort();

  // 2) Execute Query
  const { mongooseQuery, paginationResult } = apiFeatures;
  let documents = await mongooseQuery;

  // 3) Delete password
  documents = documents.map((user) => {
    delete user._doc.password;
    return user;
  });

  res.status(200).json({
    status: 200,
    results: documents.length,
    paginationResult,
    data: documents,
    success: true,
  });
});

// @desc    Get Specific User
// @route   GET /api/v1/users/:id
// @access  Private/Admin
const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);

  if (!user) {
    throw next(new ApiError('User Not Exists', 404));
  }

  res.status(200).json({ status: 200, data: user, success: true });
});

// @desc    Delete Specific User
// @route   DELETE /api/v1/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findByIdAndDelete(id);

  if (!user) {
    throw next(new ApiError('User Not Exists', 404));
  }

  res
    .status(200)
    .json({ status: 200, message: 'User Deleted Successfully', success: true });
});

export {
  getCurrentUser,
  updateUser,
  deleteCurrentUser,
  changeUserPassword,
  allUsers,
  getUser,
  deleteUser,
};
