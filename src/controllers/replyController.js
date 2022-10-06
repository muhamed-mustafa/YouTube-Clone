import asyncHandler from 'express-async-handler';
import { Reply } from '../models/replyModel.js';
import { Comment } from '../models/commentModel.js';
import { ApiError } from '../utils/apiError.js';

// @desc    Create a new reply on a specific comment
// @route   POST /api/v1/reply
// @access  Public
const createNewReply = asyncHandler(async (req, res) => {
  const { commentId, content } = req.body;

  // 1 Create a new comment on a specific video
  const reply = await Reply.create({
    commentId,
    content,
    userId: req.user.id,
  });

  // save the reply on comments replies
  await Comment.findByIdAndUpdate(
    commentId,
    { $addToSet: { replies: reply } },
    { new: true }
  );

  res.json({
    status: 201,
    message: 'Reply Created Successfully',
    data: reply,
    success: true,
  });
});

// @desc    Get all replies on specific comments
// @route   GET /api/v1/reply/:commentId
// @access  Public
const getReplies = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  const replies = await Reply.find({ commentId }).sort({ createdAt: -1 });
  if (!replies) {
    res.json({ status: 404, message: 'No replies found', success: false });
  }

  res.json({
    status: 200,
    data: replies,
    success: true,
  });
});

// @desc    Update specific reply on specific comment
// @route   PATCH /api/v1/reply/:id
// @access  Public
const updateReply = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  let reply = await Reply.findById(id);

  if (reply.userId.toString() !== req.user.id.toString()) {
    return next(new ApiError(`You are't authorized to update this reply`, 401));
  }

  reply = await Reply.findByIdAndUpdate(
    id,
    { $set: { ...req.body } },
    { new: true }
  );

  res.json({
    status: 200,
    data: reply,
    success: true,
  });
});

// @desc    Delete specific reply on specific comment
// @route   DELETE /api/v1/reply/:id
// @access  Public
const deleteReply = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  let reply = await Reply.findById(id);

  if (reply.userId.toString() !== req.user.id.toString()) {
    return next(
      new ApiError(`You are't authorized to delete this comment`, 401)
    );
  } else {
    reply = await Reply.findByIdAndDelete(id);

    await Comment.findByIdAndUpdate(
      reply.commentId,
      { $pull: { replies: reply.id } },
      { new: true }
    );
  }

  res.json({
    status: 200,
    message: `Reply deleted successfully`,
    success: true,
  });
});

export { createNewReply, getReplies, updateReply, deleteReply };
