import { ApiError } from '../utils/apiError.js';
import asyncHandler from 'express-async-handler';

// @desc Authorization (User Permissions)
// ["admin"]
export const allowedTo = (...roles) =>
  asyncHandler(async (req, _res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError('You are not allowed to access this route', 403)
      );
    }

    next();
  });
