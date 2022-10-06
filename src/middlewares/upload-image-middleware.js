import multer from 'multer';
import { ApiError } from '../utils/apiError.js';

const storage = multer.memoryStorage();

const multerFilter = function (_req, file, cb) {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new ApiError('Only Images allowed', 400), false);
  }
};

const upload = multer({ storage, fileFilter: multerFilter });

export { upload };
