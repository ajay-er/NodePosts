import cors from 'cors';
import express, { Express } from 'express';
import helmet from 'helmet';
import passport from 'passport';
import { pino } from 'pino';

import { openAPIRouter } from '@/api-docs/openAPIRouter';
import errorHandler from '@/common/middleware/errorHandler';
import rateLimiter from '@/common/middleware/rateLimiter';
import requestLogger from '@/common/middleware/requestLogger';
import { env } from '@/common/utils/envConfig';

import { postRouter } from './api/post/postRouter';
import { userRouter } from './api/user/userRouter';

const logger = pino({ name: 'server start' });
const app: Express = express();

// Set the application to trust the reverse proxy
app.set('trust proxy', true);

// Middlewares
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use(helmet());
app.use(rateLimiter);
app.use(passport.initialize());

// Request logging
app.use(requestLogger);

// Routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/posts', postRouter);

// Swagger UI
app.use(openAPIRouter);

// Error handlers
app.use(errorHandler());

export { app, logger };
