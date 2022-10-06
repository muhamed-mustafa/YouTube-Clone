import { ApiError } from '../utils/apiError.js';
import asyncHandler from 'express-async-handler';
import { Category } from '../models/categoryModel.js';

// @desc    Create a new category
// @route   POST /api/v1/category
// @access  Private/Admin
const createNewCategory = asyncHandler(async (req, res) => {
  const category = await Category.create({ ...req.body, userId: req.user.id });

  res.json({
    status: 201,
    message: 'Category Created Successfully',
    data: category,
    success: true,
  });
});

// @desc    Get a specific category
// @route   GET /api/v1/category/:id
// @access  Private/Admin
const getCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const category = await Category.findById(id);
  if (!category) {
    return next(new ApiError('Category not found', 404));
  }

  res.json({
    status: 200,
    data: category,
    success: true,
  });
});

// @desc    Get all categories
// @route   GET /api/v1/category
// @access  Private/Admin
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({});

  res.json({
    status: 200,
    data: categories,
    success: true,
  });
});

// @desc    Update specific category
// @route   PATCH /api/v1/category/:id
// @access  Private/Admin
const updateCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const category = await Category.findByIdAndUpdate(
    id,
    { $set: { ...req.body } },
    { new: true }
  );

  if (!category) {
    return next(new ApiError('Category not found', 404));
  }

  res.json({
    status: 200,
    message: 'Category updated successfully',
    data: category,
    success: true,
  });
});

// @desc    Delete a specific category
// @route   DELETE /api/v1/category/:id
// @access  Private/Admin
const deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const category = await Category.findByIdAndDelete(id);
  if (!category) {
    return next(new ApiError('Category not found', 404));
  }

  res.json({
    status: 204,
    message: 'Category deleted successfully',
    success: true,
  });
});

export {
  createNewCategory,
  getCategory,
  updateCategory,
  deleteCategory,
  getCategories,
};
