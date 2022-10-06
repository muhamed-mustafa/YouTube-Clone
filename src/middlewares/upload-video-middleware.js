import multer from 'multer';
import { ApiError } from '../utils/apiError.js';
import { v4 as uuidv4 } from 'uuid';

const videoStorage = multer.diskStorage({
  destination: 'videos',
  filename: (req, _file, cb) => {
    const filename = `${req.user.id}-${uuidv4()}`;
    req.filename = filename;
    cb(null, filename);
  },
});

const fileFilter = function (_req, file, cb) {
  if (!file.originalname.match(/\.(mp4|MPEG-4|mkv|MOV)$/)) {
    cb(new ApiError('Video format not supported', 400), false);
  }

  cb(null, true);
};
const videoUpload = multer({
  storage: videoStorage,
  limits: { fieldSize: 90000000 * 5 },
  fileFilter,
});

export { videoUpload };
