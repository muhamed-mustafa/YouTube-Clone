import { ApiError } from '../utils/apiError.js';
import asyncHandler from 'express-async-handler';
import { Video } from '../models/videoModel.js';
import { User } from '../models/userModel.js';
import fs from 'fs';

// @desc    Create a new video
// @route   POST /api/v1/video
// @access  Public
const createNewVideo = asyncHandler(async (req, res) => {
  const newVideo = await Video.create({
    ...req.body,
    videoPath: req.filename,
    owner: req.user.id,
  });

  await User.findByIdAndUpdate(
    req.user.id,
    { $addToSet: { videos: newVideo } },
    { new: true }
  );

  res.json({
    status: 201,
    message: 'Video Created Successfully',
    data: newVideo,
    success: true,
  });
});

// @desc    Streaming video
// @route   GET /api/v1/video/:filename
// @access  Public
const streamingVideo = asyncHandler(async (req, res) => {
  const { range } = req.headers;

  if (!range) {
    return new ApiError('Requires Range header', 400);
  }

  const videoPath = `videos/${req.params.filename}`;
  const videoSize = fs.statSync(videoPath).size;

  const CHUNK_SIZE = 10 ** 6; // 1MB
  const start = Number(range.replace(/\D/g, ''));
  const end = Math.min(CHUNK_SIZE + start, videoSize - 1);
  const contentLength = end - start + 1;

  const headers = {
    'Content-Range': `bytes ${start}-${end}/${videoSize}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': contentLength,
    'Content-Type': 'video/mp4',
  };

  res.writeHead(206, headers);
  const videoStream = fs.createReadStream(videoPath, { start, end });
  videoStream.pipe(res);
});

// @desc    Get specific video
// @route   GET /api/v1/video
// @access  Public
const getVideo = asyncHandler(async (req, res, next) => {
  const { id } = req.query;
  const video = await Video.findById(id).populate({
    path: 'comments',
    populate: {
      path: 'replies',
    },
  });

  res.json({
    status: 200,
    data: video,
    commentsLength: video.commentsCount,
    success: true,
  });
});

// @desc    Update specific video
// @route   PATCH /api/v1/video
// @access  Public
const updateVideo = asyncHandler(async (req, res, next) => {
  const { id } = req.query;

  const video = await Video.findByIdAndUpdate(
    id,
    { $set: { ...req.body } },
    { new: true }
  );

  if (!video) {
    return next(new ApiError('Video not found', 404));
  }

  if (video.owner !== req.user.id) {
    return next(
      new ApiError(
        'You are not allowed to update this video because this video not belong to you.',
        400
      )
    );
  }

  res.json({
    status: 200,
    message: 'Video updated successfully',
    data: video,
    success: true,
  });
});

// @desc    Delete a specific video
// @route   DELETE /api/v1/video/:id
// @access  Public
const deleteVideo = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  let video = await Video.findById(id);
  const videoPath = `videos/${video.videoPath}`;

  if (fs.existsSync(videoPath)) {
    fs.unlink(videoPath, (err) => {
      if (err) return next(new ApiError(`${err.message}`, 500));
    });

    if (video.owner.toString() !== req.user.id) {
      return next(
        new ApiError(
          'You are not allowed to delete this video because this video not belong to you.',
          400
        )
      );
    } else {
      await User.findByIdAndUpdate(
        req.user.id,
        { $pull: { videos: video.id } },
        { new: true }
      );
      await video.remove();
    }

    res.json({
      status: 204,
      message: 'Video deleted successfully',
      success: true,
    });
  } else {
    return next(new ApiError('Video not found', 404));
  }
});

// @desc    Like a specific video
// @route   PATCH /api/v1/video/like/:id
// @access  Public
const likeVideo = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const currentUser = req.user.id;

  const video = await Video.findById(id);
  if (!video) {
    return next(new ApiError('Video not found', 404));
  }

  await Video.findByIdAndUpdate(id, {
    $addToSet: { likes: currentUser },
    $pull: { dislikes: currentUser },
  });

  res.json({
    status: 200,
    message: 'Video liked successfully',
    success: true,
  });
});

// @desc    dislike a specific video
// @route   PATCH /api/v1/video/dislike/:id
// @access  Public
const dislikeVideo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const currentUser = req.user.id;

  await Video.findByIdAndUpdate(id, {
    $addToSet: { dislikes: currentUser },
    $pull: { likes: currentUser },
  });

  res.json({
    status: 200,
    message: 'Video disLiked successfully',
    success: true,
  });
});

export {
  createNewVideo,
  streamingVideo,
  getVideo,
  updateVideo,
  deleteVideo,
  likeVideo,
  dislikeVideo,
};
