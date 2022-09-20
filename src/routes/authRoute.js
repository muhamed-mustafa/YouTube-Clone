import express from 'express';
import { createUserValidator } from '../utils/validators/authValidator.js';
import {
  signUp,
  login,
  logout,
  forgotPassword,
  verifyPassResetCode,
  resetPassword,
} from '../controllers/authController.js';
import { protect } from '../middlewares/protectMiddleware.js';
import { upload } from '../middlewares/uploadImageMiddleware.js';

const router = express.Router();

router.post(
  '/signup',
  upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 },
  ]),
  createUserValidator,
  signUp
);

router.post('/login', login);

router.use(protect);

router.post('/logout', logout);

router.post('/forgotPassword', forgotPassword);

router.post('/verifyResetCode', verifyPassResetCode);

router.put('/resetPassword', resetPassword);

export { router as AuthRoute };
