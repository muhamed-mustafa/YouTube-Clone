import { ApiError } from '../utils/apiError.js';
import asyncHandler from 'express-async-handler';
import { Video } from '../models/videoModel.js';
import { playList } from '../models/playlist.model.js';

// @desc    Create a new playlist
// @route   POST /api/v1/playlist
// @access  Public
const createNewPlayList = asyncHandler(async (req, res) => {
  const { playListName } = req.body;

  const newPlayList = await playList.create({
    owner: req.user.id,
    playListName,
  });

  res.json({
    status: 201,
    message: 'PlayList Created Successfully',
    data: newPlayList,
    success: true,
  });
});

// @desc    Add videos to playlist
// @route   POST /api/v1/playlist/:videoId
// @access  Public
const addVideoToPlayList = asyncHandler(async (req, res) => {
  const { playListName } = req.body;
  const { videoId } = req.params;

  const name = await playList.findOne({ playListName });
  const video = await Video.findById(videoId);

  const result = await playList.findByIdAndUpdate(
    { _id: name._id },
    { $addToSet: { videos: video._id } },
    { new: true }
  );

  res.json({
    status: 200,
    message: 'Video Added Successfully To PlayList',
    data: result,
    success: true,
  });
});

// @desc    Remove video from playlist
// @route   PATCH /api/v1/playlist/:videoId
// @access  Public
const removeVideoFromPlayList = asyncHandler(async (req, res) => {
  const { playListName } = req.body;
  const { videoId } = req.params;

  const name = await playList.findOne({ playListName });
  const video = await Video.findById(videoId);

  const result = await playList.findByIdAndUpdate(
    { _id: name._id },
    { $pull: { videos: video._id } },
    { new: true }
  );

  res.json({
    status: 200,
    message: 'Video Removed Successfully From PlayList',
    data: result,
    success: true,
  });
});

// @desc    Update name of playlist
// @route   PATCH /api/v1/playlist/:id
// @access  Public
const updatePlayListName = asyncHandler(async (req, res, next) => {
  const { playListName } = req.body;
  const name = await playList.findById(req.query.id);

  if (req.user.id.toString() !== name.owner.toString()) {
    return next(
      new ApiError(`You are't authorized to update this playList`, 401)
    );
  }

  const result = await playList.findByIdAndUpdate(
    { _id: name._id },
    { $set: { playListName } },
    { new: true }
  );

  res.json({
    status: 200,
    message: 'PlayListName updated successfully',
    data: result,
    success: true,
  });
});

// @desc    Delete playlist
// @route   DELETE /api/v1/playlist/:id
// @access  Public
const deletePlayList = asyncHandler(async (req, res, next) => {
  const name = await playList.findById(req.query.id);

  if (req.user.id.toString() !== name.owner.toString()) {
    return next(
      new ApiError(`You are't authorized to delete this playList`, 401)
    );
  }

  await playList.findByIdAndDelete({ _id: name._id });

  res.json({
    status: 200,
    message: 'PlayListName deleted successfully',
    success: true,
  });
});

export {
  createNewPlayList,
  addVideoToPlayList,
  removeVideoFromPlayList,
  updatePlayListName,
  deletePlayList,
};
