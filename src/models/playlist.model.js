import { Schema, model } from 'mongoose';

const playListSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    videos: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Video',
        required: true,
      },
    ],

    playListName: {
      type: String,
      required: [true, 'playListName is required'],
    },
  },
  { timestamps: true }
);

export const playList = model('playList', playListSchema);
