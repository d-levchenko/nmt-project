import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';

import dns from 'node:dns';

import { logger } from './middleware/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';

import { connectMongoDB } from './db/connectDB.js';

import quizRouter from './routes/quizRoutes.js';
import attemptRouter from './routes/attemptRoutes.js';

dns.setServers(['1.1.1.1', '8.8.8.8']);

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(express.json());
app.use(cors({ origin: process.env.CORS_FRONTEND_URL, credentials: true }));
app.use(cookieParser());
app.use(logger);

// routes
app.use('api/quizzes', quizRouter);
app.use('api/quiz-attemps', attemptRouter);

// 404
app.use(notFoundHandler);

// 500
app.use(errorHandler);

await connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
