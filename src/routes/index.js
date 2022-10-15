import { AuthRoute } from './authRoute.js';
import { userRoute } from './userRoute.js';
import { categoryRoute } from './categoryRoute.js';
import { videoRoute } from './videoRoute.js';
import { commentRoute } from './commentRoute.js';
import { replyRoute } from './replyRoute.js';
import { playListRoute } from '../routes/playListRoute.js';

export const mountRoutes = (app) => {
  app.use('/api/v1/auth', AuthRoute);
  app.use('/api/v1/users', userRoute);
  app.use('/api/v1/category', categoryRoute);
  app.use('/api/v1/video', videoRoute);
  app.use('/api/v1/comment', commentRoute);
  app.use('/api/v1/reply', replyRoute);
  app.use('/api/v1/playlist', playListRoute);
};
