import { ApiError } from '../utils/apiError.js';
import asyncHandler from 'express-async-handler';
import { Video } from '../models/videoModel.js';
import { User } from '../models/userModel.js';
import { ApiFeatures } from '../utils/apiFeatures.js';
import fs from 'fs';
import geoip from 'geoip-lite';

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

// @desc    Get All videos
// @route   GET /api/v1/video/all
// @access  Public
const allVideos = asyncHandler(async (req, res) => {
  let filter = {};
  if (req.filterObj) {
    filter = req.filterObj;
  }

  const documentCounts = await Video.countDocuments();
  const apiFeatures = new ApiFeatures(Video.find(filter), req.query)
    .paginate(documentCounts)
    .filter()
    .search()
    .limitFields()
    .sort();

  const { mongooseQuery, paginationResult } = apiFeatures;
  let documents = await mongooseQuery;

  res.status(200).json({
    status: 200,
    results: documents.length,
    paginationResult,
    data: documents,
    success: true,
  });
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
    viewsCount: video.views.length,
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

// @desc    Get views by location
// @route   PATCH /api/v1/video/views/:id
// @access  Admin
const getViewsByLocation = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const video = await Video.findById(id);

  const total_view = video.views.length;
  let location_view_data = [];

  video.views.map((ip) => {
    const data = geoip.lookup(ip);
    location_view_data.push(data);
  });

  let results = {
    total_views: total_view,
    location_view_data,
  };

  res.json({
    status: 200,
    results,
    success: true,
  });
});

// @desc    Get random videos
// @route   GET /api/v1/video/random
// @access  Public
const randomVideos = asyncHandler(async (_req, res) => {
  const videos = await Video.aggregate([{ $sample: { size: 20 } }]);

  res.json({
    status: 200,
    videos,
    success: true,
  });
});

// @desc    Get trend videos
// @route   GET /api/v1/video/trend
// @access  Public
const trendVideos = asyncHandler(async (_req, res) => {
  const videos = await Video.find().sort({ views: -1 }).limit(10);

  res.json({
    status: 200,
    videos,
    success: true,
  });
});

// @desc    Get videos by tags
// @route   GET /api/v1/video/tags
// @access  Public
const getByTag = asyncHandler(async (req, res) => {
  const tags = req.query.tags.split(',');

  const videos = await Video.find({ tags: { $in: tags } }).limit(10);

  res.json({
    status: 200,
    videos,
    success: true,
  });
});

// @desc    Search on vidoes by name
// @route   GET /api/v1/video/search
// @access  Public

const search = asyncHandler(async (req, res) => {
  const { name } = req.query;

  const videos = await Video.find({
    name: { $regex: name, $options: 'i' },
  }).limit(100);

  res.json({
    status: 200,
    videos,
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
  getViewsByLocation,
  allVideos,
  randomVideos,
  trendVideos,
  getByTag,
  search,
};
