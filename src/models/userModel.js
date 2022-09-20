import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new Schema(
  {
    userName: {
      type: String,
      trim: true,
      required: [true, 'userName required'],
      unique: true,
    },

    firstName: {
      type: String,
      trim: true,
      required: [true, 'firstName required'],
    },

    lastName: {
      type: String,
      trim: true,
      required: [true, 'firstName required'],
    },

    slug: {
      type: String,
      lowercase: true,
    },

    email: {
      type: String,
      required: [true, 'email required'],
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: [true, 'password required'],
      minlength: [6, 'Too short password'],
    },

    videos: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Video',
      },
    ],

    subscribers: {
      type: Array,
      default: [],
    },

    userSubScribedChannels: {
      type: Array,
      default: [],
    },

    phone: { type: String },

    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },

    age: { type: Number, required: true },

    profileImage: {
      type: String,
      default:
        'https://res.cloudinary.com/microservices/image/upload/v1663511526/th_h5mt8v.webp',
    },

    coverImage: {
      type: String,
      default:
        'https://res.cloudinary.com/microservices/image/upload/v1663596867/th_sf0joi.webp',
    },

    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified: Boolean,
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  // Hasing user password
  this.password = await bcrypt.hash(this.password, 15);
  next();
});

userSchema.methods.compare = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export const User = model('User', userSchema);
