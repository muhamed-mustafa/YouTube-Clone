import { check, body } from 'express-validator';
import { validatiorMiddleware } from '../../middlewares/validatorMiddleware.js';
import { Category } from '../../models/categoryModel.js';
import { Video } from '../../models/videoModel.js';

const createVideoValidator = [
  check('name')
    .notEmpty()
    .withMessage('name is required')
    .isLength({ min: 3 })
    .withMessage('name must be at least 3 characters long'),

  check('category')
    .notEmpty()
    .withMessage('Video must be belong to a category')
    .isMongoId()
    .withMessage('Invalid ID formate')
    .custom(async (categoryId) => {
      const category = await Category.findById(categoryId);
      if (!category) {
        return Promise.reject(
          new Error(`No category found for this id : ${categoryId}`)
        );
      }
    }),

  validatiorMiddleware,
];

const getVideoValidator = [
  check('id')
    .isMongoId()
    .withMessage('Invalid ID formate')
    .custom(async (id) => {
      const video = await Video.findById(id);
      if (!video) {
        return Promise.reject(new Error(`No video found for this id : ${id}`));
      }
    }),

  validatiorMiddleware,
];

const updateVideoValidator = [
  check('id').isMongoId().withMessage('Invalid ID formate'),

  body('name').optional(),

  check('category')
    .optional()
    .isMongoId()
    .withMessage('Invalid ID formate')
    .custom(async (categoryId) => {
      const category = await Category.findById(categoryId);
      if (!category) {
        return Promise.reject(
          new Error(`No category found for this id : ${categoryId}`)
        );
      }
    }),

  validatiorMiddleware,
];

const deleteVideoValidator = [
  check('id')
    .isMongoId()
    .withMessage('Invalid ID formate')
    .custom(async (id) => {
      const video = await Video.findById(id);
      if (!video) {
        return Promise.reject(new Error(`No video found for this id : ${id}`));
      }
    }),

  validatiorMiddleware,
];

export {
  createVideoValidator,
  getVideoValidator,
  updateVideoValidator,
  deleteVideoValidator,
};
