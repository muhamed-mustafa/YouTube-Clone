import { Schema, model } from 'mongoose';

const replySchema = new Schema(
  {
    content: {
      type: String,
      minlength: [3, 'Too short content'],
      required: [true, 'content is required'],
    },

    commentId: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
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

    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

export const Reply = model('Reply', replySchema);
