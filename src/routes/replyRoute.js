import express from 'express';
import { protect } from '../middlewares/protectMiddleware.js';
import {
  createNewReply,
  getReplies,
  updateReply,
  deleteReply,
  likeReply,
  dislikeReply,
} from '../controllers/replyController.js';
import {
  createReplyValidator,
  getRepliesValidator,
  updateReplyValidator,
  deleteReplyValidator,
} from '../utils/validators/replyValidator.js';

const router = express.Router();

router.use(protect);

router.post('/', createReplyValidator, createNewReply);

router.get('/:commentId', getRepliesValidator, getReplies);

router.patch('/:id', updateReplyValidator, updateReply);

router.delete('/:id', deleteReplyValidator, deleteReply);

router.patch('/like/:id', likeReply);

router.patch('/dislike/:id', dislikeReply);

export { router as replyRoute };
