import { body, check } from 'express-validator';
import { validatiorMiddleware } from '../../middlewares/validatorMiddleware.js';
import { Video } from '../../models/videoModel.js';
import { Comment } from '../../models/commentModel.js';

const createCommentValidator = [
  check('content')
    .notEmpty()
    .withMessage('content is required')
    .isLength({ min: 3 })
    .withMessage('Too short content')
    .isLength({ max: 32 })
    .withMessage('Too long content'),

  check('videoId')
    .notEmpty()
    .withMessage('Video Id is required')
    .isMongoId()
    .withMessage('Invalid video id format')
    .custom(async (videoId) => {
      const video = await Video.findById(videoId);
      if (!video) {
        return Promise.reject(
          new Error(`No video found for this id : ${videoId}`)
        );
      }
    }),

  validatiorMiddleware,
];

const getCommentValidator = [
  check('id').isMongoId().withMessage('Invalid commentId format'),
  validatiorMiddleware,
];

const getCommentsValidator = [
  check('videoId')
    .isMongoId()
    .withMessage('Invalid comment videoId format')
    .custom(async (videoId) => {
      const video = await Video.findById(videoId);
      if (!video) {
        return Promise.reject(
          new Error(`No video found for this id : ${videoId}`)
        );
      }
    }),

  validatiorMiddleware,
];

const updateCommentValidator = [
  check('id')
    .isMongoId()
    .withMessage('Invalid id format')
    .custom(async (id) => {
      const comment = await Comment.findById(id);
      if (!comment) {
        return Promise.reject(
          new Error(`No comment found for this id : ${id}`)
        );
      }
    }),

  body('content')
    .optional()
    .notEmpty()
    .withMessage('content required')
    .isLength({ min: 3 })
    .withMessage('Too short content')
    .isLength({ max: 32 })
    .withMessage('Too long content'),

  validatiorMiddleware,
];

const deleteCommentValidator = [
  check('id')
    .isMongoId()
    .withMessage('Invalid id format')
    .custom(async (id) => {
      const comment = await Comment.findById(id);
      if (!comment) {
        return Promise.reject(
          new Error(`No comment found for this id : ${id}`)
        );
      }
    }),

  validatiorMiddleware,
];

export {
  createCommentValidator,
  getCommentsValidator,
  getCommentValidator,
  updateCommentValidator,
  deleteCommentValidator,
};
