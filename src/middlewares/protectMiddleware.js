import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import { ApiError } from '../utils/apiError.js';
import { User } from '../models/userModel.js';

// @desc   make sure the user is logged in
const protect = asyncHandler(async (req, _res, next) => {
  // 1) Check if session exists or not
  if (!req.session.jwt) {
    return next();
  }

  // 2) Verify session
  let decoded = jwt.verify(req.session.jwt, process.env.JWT_SECRET_KEY);

  // 3) Check if user exists
  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
    return next(new ApiError('User Not Exists', 404));
  }

  // 4) Check if user change his password after token created
  if (currentUser.passwordChangedAt) {
    const passChangedTimestamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );

    // Password changed after token created (Error)
    if (passChangedTimestamp > decoded.iat) {
      return next(
        new ApiError(
          'User recently changed his password. please login again..',
          401
        )
      );
    }
  }

  req.user = currentUser;
  next();
});

export { protect };
