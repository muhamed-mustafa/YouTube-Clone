import { body, check } from 'express-validator';
import { validatiorMiddleware } from '../../middlewares/validatorMiddleware.js';
import { Category } from '../../models/categoryModel.js';

const createCategoryValidator = [
  check('name')
    .notEmpty()
    .withMessage('Category name required')
    .isLength({ min: 3 })
    .withMessage('Too short category name')
    .isLength({ max: 32 })
    .withMessage('Too long category name')
    .custom(async (val) => {
      const category = await Category.findOne({ name: val });
      if (category) {
        return Promise.reject(new Error('Category name is already exists'));
      }
      return true;
    }),

  check('description')
    .notEmpty()
    .withMessage('description is required')
    .isLength({ min: 3 })
    .withMessage('Too short description')
    .isLength({ max: 100 })
    .withMessage('Too long description'),

  validatiorMiddleware,
];

const getCategoryValidator = [
  check('id').isMongoId().withMessage('Invalid category id format'),
  validatiorMiddleware,
];

const updateCategoryValidator = [
  check('id').isMongoId().withMessage('Invalid category id format'),

  body('name')
    .optional()
    .notEmpty()
    .withMessage('Category name required')
    .isLength({ min: 3 })
    .withMessage('Too short category name')
    .isLength({ max: 32 })
    .withMessage('Too long category name')
    .custom(async (val) => {
      const category = await Category.findOne({ name: val });
      if (category) {
        return Promise.reject(new Error('Category name is already exists'));
      }
      return true;
    }),

  body('description')
    .optional()
    .notEmpty()
    .withMessage('description is required')
    .isLength({ min: 3 })
    .withMessage('Too short description')
    .isLength({ max: 100 })
    .withMessage('Too long description'),

  validatiorMiddleware,
];

const deleteCategoryValidator = [
  check('id').isMongoId().withMessage('Invalid category id format'),
  validatiorMiddleware,
];

export {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
};
