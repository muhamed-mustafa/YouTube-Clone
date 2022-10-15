import express from 'express';
import { protect } from '../middlewares/protectMiddleware.js';
import {
  addVideoToPlayList,
  createNewPlayList,
  removeVideoFromPlayList,
  updatePlayListName,
  deletePlayList,
} from '../controllers/playlistController.js';
import {
  getPlayListValidator,
  createPlayListValidator,
  deletePlayListValidator,
  updatePlayListValidator,
} from '../utils/validators/playlistValidator.js';

const router = express.Router();

router.use(protect);

router.post('/', createPlayListValidator, createNewPlayList);

router.post('/:videoId', getPlayListValidator, addVideoToPlayList);

router.patch('/:videoId', getPlayListValidator, removeVideoFromPlayList);

router.patch('/', updatePlayListValidator, updatePlayListName);

router.delete('/', deletePlayListValidator, deletePlayList);

export { router as playListRoute };
