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
} from '../controllers/userController.js';
import { protect } from '../middlewares/protectMiddleware.js';
import { upload } from '../middlewares/upload-image-middleware.js';
import { allowedTo } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/cuurent-user', getCurrentUser);

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

router.use(allowedTo('admin'));

router.get('/', allUsers);

router.get('/:id', getUserValidator, getUser);

router.delete('/:id', deleteUserValidator, deleteUser);

export { router as userRoute };
