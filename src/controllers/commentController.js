import asyncHandler from 'express-async-handler';
import { Comment } from '../models/commentModel.js';
import { Video } from '../models/videoModel.js';
import { ApiError } from '../utils/apiError.js';
import { Reply } from '../models/replyModel.js';

// @desc    Create a new comment on a specific video
// @route   POST /api/v1/comment
// @access  Public
const createNewComment = asyncHandler(async (req, res) => {
  const { videoId, content } = req.body;

  // 1 Create a new comment on a specific video
  const comment = await Comment.create({
    videoId,
    content,
    userId: req.user.id,
  });

  // save the comment on video comments
  await Video.findByIdAndUpdate(
    videoId,
    { $addToSet: { comments: comment } },
    { new: true }
  );

  res.json({
    status: 201,
    message: 'Comment Created Successfully',
    data: comment,
    success: true,
  });
});

// @desc    Get specific comment
// @route   GET /api/v1/comment
// @access  Public
const getComment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const comment = await Comment.findById(id)
    .populate('replies')
    .sort({ createdAt: -1 });

  if (!comment) {
    res.json({ status: 404, message: 'No comment found', success: false });
  }

  res.json({
    status: 200,
    data: comment,
    repliesLength: comment.repliesCount,
    success: true,
  });
});

// @desc    Get all comments on specific video
// @route   GET /api/v1/comment/:videoId
// @access  Public
const getComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const comments = await Comment.find({ videoId }).sort({ createdAt: -1 });

  if (!comments) {
    res.json({ status: 404, message: 'No comments found', success: false });
  }

  res.json({
    status: 200,
    data: comments,
    success: true,
  });
});

// @desc    Update specific comment on specific video
// @route   PATCH /api/v1/comment/:id
// @access  Public
const updateComment = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  let comment = await Comment.findById(id);

  if (comment.userId.toString() !== req.user.id.toString()) {
    return next(
      new ApiError(`You are't authorized to update this comment`, 401)
    );
  }

  comment = await Comment.findByIdAndUpdate(
    id,
    { $set: { ...req.body } },
    { new: true }
  );

  res.json({
    status: 200,
    data: comment,
    success: true,
  });
});

// @desc    Delete specific comment on specific video
// @route   DELETE /api/v1/comment/:id
// @access  Public
const deleteComment = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  let comment = await Comment.findById(id);

  if (comment.userId.toString() !== req.user.id.toString()) {
    return next(
      new ApiError(`You are't authorized to delete this comment`, 401)
    );
  } else {
    comment = await Comment.findByIdAndDelete(id);

    await Video.findByIdAndUpdate(
      comment.videoId,
      { $pull: { comments: comment.id } },
      { new: true }
    );

    await Reply.deleteMany({ commentId: comment.id });
  }

  res.json({
    status: 200,
    message: `Comment deleted successfully`,
    success: true,
  });
});

export {
  createNewComment,
  getComments,
  updateComment,
  deleteComment,
  getComment,
};
