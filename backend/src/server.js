import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import dns from 'node:dns';
import { logger } from './middleware/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { connectMongoDB } from './db/conn.js';
import quizRouter from './routes/quizRoutes.js';

dns.setServers(['1.1.1.1', '8.8.8.8']);

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS_FRONTEND_URL,
  }),
);
app.use(logger);

app.use(quizRouter);

// 404
app.use(notFoundHandler);

// 500
app.use(errorHandler);

await connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
