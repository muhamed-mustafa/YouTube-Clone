import { Schema, model } from 'mongoose';

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name required'],
      unique: [true, ' Cateory must be unique'],
      minlength: [3, 'Too short category name'],
      maxlength: [32, 'Too long category name'],
    },

    description: {
      type: String,
      minlength: [3, 'Description must be three characters long'],
      maxlength: [100, 'Too long description'],
      required: [true, 'Description is required'],
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

export const Category = model('Category', categorySchema);
