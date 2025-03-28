import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import passport from 'passport';
import { envConfig } from './config/envConfig.js';
import globalErrorHandler from './middlewares/globalError.js';
import productRouter from './routes/product.route.js';
import userRouter from './routes/user.route.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept'],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

if (envConfig.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else if (envConfig.nodeEnv === 'production') {
  const logStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {
    flags: 'a',
  });
  app.use(morgan('combined', { stream: logStream }));
}

// Routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter);

// Global Error
app.use(globalErrorHandler);
export default app;
