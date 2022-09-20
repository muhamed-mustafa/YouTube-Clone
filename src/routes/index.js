import { AuthRoute } from './authRoute.js';
import { userRoute } from './userRoute.js';

export const mountRoutes = (app) => {
  app.use('/api/v1/auth', AuthRoute);
  app.use('/api/v1/users', userRoute);
};
