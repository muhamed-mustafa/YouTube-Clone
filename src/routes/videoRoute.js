import express from 'express';
import { protect } from '../middlewares/protectMiddleware.js';
import {
  createNewVideo,
  streamingVideo,
  getVideo,
  updateVideo,
  deleteVideo,
  likeVideo,
  dislikeVideo,
  getViewsByLocation,
  allVideos,
  randomVideos,
  trendVideos,
  getByTag,
  search,
} from '../controllers/videoController.js';
import {
  createVideoValidator,
  getVideoValidator,
  updateVideoValidator,
  deleteVideoValidator,
} from '../utils/validators/videoValidator.js';
import { videoUpload } from '../middlewares/upload-video-middleware.js';
import { addIP } from '../middlewares/ipMiddleware.js';

const router = express.Router();

router.get('/tags', getByTag);

router.get('/random', randomVideos);

router.get('/trend', trendVideos);

router.get('/search', search);

router.use(protect);

router.post(
  '/',
  videoUpload.single('video'),
  createVideoValidator,
  createNewVideo
);

router.get('/all', allVideos);

router.get('/', getVideoValidator, getVideo);

router.get('/:filename', addIP, streamingVideo);

router.patch('/', updateVideoValidator, updateVideo);

router.delete('/:id', deleteVideoValidator, deleteVideo);

router.patch('/like/:id', likeVideo);

router.patch('/dislike/:id', dislikeVideo);

router.get('/views/:id', getVideoValidator, getViewsByLocation);

export { router as videoRoute };
