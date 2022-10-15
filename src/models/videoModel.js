import { Schema, model } from 'mongoose';

const videoSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    name: {
      type: String,
      required: [true, 'Video name is required'],
    },

    videoPath: {
      type: String,
      required: [true, 'Video path is required'],
      unique: [true, 'Video path is already exists'],
    },

    tags: {
      type: Array,
      default: [],
    },

    likes: {
      type: Array,
      default: [],
    },

    dislikes: {
      type: Array,
      default: [],
    },

    views: {
      type: Array,
    },

    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],

    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },
  },
  { timestamps: true }
);

videoSchema.virtual('commentsCount').get(function () {
  return this.comments.length;
});

videoSchema.pre('remove', async function (next) {
  const Comment = model('Comment');

  await Comment.remove({
    _id: { $in: this.comments.map((comment) => comment._id) },
  });

  next();
});

export const Video = model('Video', videoSchema);
