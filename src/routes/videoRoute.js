import express from 'express';
import { protect } from '../middlewares/protectMiddleware.js';
import {
  createNewVideo,
  streamingVideo,
  getVideo,
  updateVideo,
  deleteVideo,
} from '../controllers/videoController.js';
import {
  createVideoValidator,
  getVideoValidator,
  updateVideoValidator,
  deleteVideoValidator,
} from '../utils/validators/videoValidator.js';
import { videoUpload } from '../middlewares/upload-video-middleware.js';

const router = express.Router();

router.use(protect);

router.post(
  '/',
  videoUpload.single('video'),
  createVideoValidator,
  createNewVideo
);

router.get('/:filename', streamingVideo);

router.get('/', getVideoValidator, getVideo);

router.patch('/', updateVideoValidator, updateVideo);

router.delete('/:id', deleteVideoValidator, deleteVideo);

export { router as videoRoute };
