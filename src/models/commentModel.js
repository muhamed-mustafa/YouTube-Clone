import { Schema, model } from 'mongoose';

const commentSchema = new Schema(
  {
    content: {
      type: String,
      minlength: [3, 'Too short content'],
      required: [true, 'content is required'],
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    videoId: {
      type: Schema.Types.ObjectId,
      ref: 'Video',
      required: true,
    },

    likes: {
      type: Array,
      default: [],
    },

    dislikes: {
      type: Array,
      default: [],
    },

    replies: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Reply',
      },
    ],
  },
  { timestamps: true }
);

commentSchema.virtual('repliesCount').get(function () {
  return this.replies.length;
});

export const Comment = model('Comment', commentSchema);
