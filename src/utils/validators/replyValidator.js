import { body, check } from 'express-validator';
import { validatiorMiddleware } from '../../middlewares/validatorMiddleware.js';
import { Comment } from '../../models/commentModel.js';
import { Reply } from '../../models/replyModel.js';

const createReplyValidator = [
  check('content')
    .notEmpty()
    .withMessage('content is required')
    .isLength({ min: 3 })
    .withMessage('Too short content')
    .isLength({ max: 32 })
    .withMessage('Too long content'),

  check('commentId')
    .notEmpty()
    .withMessage('commentId is required')
    .isMongoId()
    .withMessage('Invalid commentId format')
    .custom(async (commentId) => {
      const comment = await Comment.findById(commentId);
      if (!comment) {
        return Promise.reject(
          new Error(`No comment found for this id : ${commentId}`)
        );
      }
    }),

  validatiorMiddleware,
];

const getRepliesValidator = [
  check('commentId')
    .isMongoId()
    .withMessage('Invalid Reply id format')
    .custom(async (commentId) => {
      const comment = await Comment.findById(commentId);
      if (!comment) {
        return Promise.reject(
          new Error(`No comment found for this id : ${commentId}`)
        );
      }
    }),

  validatiorMiddleware,
];

const updateReplyValidator = [
  check('id')
    .isMongoId()
    .withMessage('Invalid id format')
    .custom(async (id) => {
      const reply = await Reply.findById(id);
      if (!reply) {
        return Promise.reject(new Error(`No reply found for this id : ${id}`));
      }
    }),

  body('content')
    .optional()
    .notEmpty()
    .withMessage('content is required')
    .isLength({ min: 3 })
    .withMessage('Too short content')
    .isLength({ max: 32 })
    .withMessage('Too long content'),

  validatiorMiddleware,
];

const deleteReplyValidator = [
  check('id')
    .isMongoId()
    .withMessage('Invalid id format')
    .custom(async (id) => {
      const reply = await Reply.findById(id);
      if (!reply) {
        return Promise.reject(new Error(`No reply found for this id : ${id}`));
      }
    }),

  validatiorMiddleware,
];

export {
  createReplyValidator,
  getRepliesValidator,
  updateReplyValidator,
  deleteReplyValidator,
};
