import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application } from 'express';
import morgan from 'morgan';
import passport from 'passport';
import globalErrorHandler from './middlewares/globalError';
import productRouter from './routes/product.route';
import userRouter from './routes/user.route';

const app: Application = express();

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
app.use(morgan('dev'));
app.use(passport.initialize());

// Routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter);

// Global Error
app.use(globalErrorHandler);
export default app;
