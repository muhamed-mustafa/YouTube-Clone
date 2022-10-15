import { Video } from '../models/videoModel.js';
import { getIp } from '../utils/get-ip.js';

const addIP = async (req, _res, next) => {
  const ip = await getIp();

  const { filename } = req.params;

  const video = await Video.findOne({ videoPath: filename });

  if (!video.views.includes(ip)) {
    await Video.findOneAndUpdate(
      { videoPath: filename },
      { $addToSet: { views: ip } },
      { new: true }
    );
  }

  next();
};

export { addIP };
