import express from 'express';
import {
  updateUserValidator,
  changeUserPasswordValidator,
  getUserValidator,
  deleteUserValidator,
} from '../utils/validators/authValidator.js';
import {
  getCurrentUser,
  updateUser,
  deleteCurrentUser,
  changeUserPassword,
  allUsers,
  getUser,
  deleteUser,
  subscribeUser,
  unSubscribeUser,
  subChannels,
} from '../controllers/userController.js';
import { protect } from '../middlewares/protectMiddleware.js';
import { upload } from '../middlewares/upload-image-middleware.js';
import { allowedTo } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/current-user', getCurrentUser);

router.patch(
  '/',
  upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 },
  ]),
  updateUserValidator,
  updateUser
);

router.delete('/', deleteCurrentUser);

router.patch(
  '/change-password',
  changeUserPasswordValidator,
  changeUserPassword
);

router.patch('/subscribe/:id', subscribeUser);

router.patch('/unsubscribe/:id', unSubscribeUser);

router.patch('/unsubscribe/:id', unSubscribeUser);

router.get('/sub-channels', subChannels);

router.use(allowedTo('admin'));

router.get('/', allUsers);

router.get('/:id', getUserValidator, getUser);

export { router as userRoute };
