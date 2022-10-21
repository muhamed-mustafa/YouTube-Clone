import express, { application } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import hpp from 'hpp';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import dotenv from 'dotenv';
import { dbConnection } from './config/database.js';
import { ApiError } from './utils/apiError.js';
import { globalError } from './middlewares/globalErrorMiddleware.js';
import { mountRoutes } from './routes/index.js';
import cookieSession from 'cookie-session';

dotenv.config({ path: 'config.env' });

// Create Express App
const app = express();

// Connect with db
dbConnection();

app.enable('trust proxy');
// Enable other domains to access your application
app.use(cors());
app.options('*', cors());

// compress all responses
app.use(compression());

app.use(express.json({ limit: '20kb' }), cookieSession({ signed: false }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // Limit each IP to 100 requests per `window` (here, per 1 hour)
  message:
    'Too many accounts created from this IP, please try again after an hour',
});

application.use('/api', limiter);

// Middleware to protect against HTTP Parameter Pollution attacks
application.use(hpp());

// Mount Routes
mountRoutes(app);

app.all('*', (req, _res, next) => {
  next(new ApiError(`Can't find this route : ${req.originalUrl}`, 400));
});

// Global error handling middleware for express
app.use(globalError);

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () =>
  console.log(`App Running On Port ${PORT}`)
);

// Handle rejection outside express
process.on('unhandledRejection', (err) => {
  console.error(`UnhandledRejection Errors : ${err.name} || ${err.message}`);
  server.close(() => {
    console.log('Shutting down....');
    process.exit(1);
  });
});
