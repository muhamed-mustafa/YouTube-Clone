import express from 'express';
import { protect } from '../middlewares/protectMiddleware.js';
import {
  createNewComment,
  getComments,
  getComment,
  updateComment,
  deleteComment,
} from '../controllers/commentController.js';
import {
  createCommentValidator,
  getCommentsValidator,
  updateCommentValidator,
  deleteCommentValidator,
  getCommentValidator,
} from '../utils/validators/commentValidator.js';

const router = express.Router();

router.use(protect);

router.post('/', createCommentValidator, createNewComment);

router.get('/:videoId', getCommentsValidator, getComments);

router.get('/specific-comment/:id', getCommentValidator, getComment);

router.patch('/:id', updateCommentValidator, updateComment);

router.delete('/:id', deleteCommentValidator, deleteComment);

export { router as commentRoute };
