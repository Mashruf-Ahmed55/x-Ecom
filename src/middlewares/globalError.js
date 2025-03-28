import { envConfig } from '../config/envConfig.js';

const globalErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message ? err.message : 'Internal Server Error';
  const stack = err.stack;
  res
    .status(statusCode)
    .json({ message, stack: envConfig.nodeEnv === 'development' && stack });
};

export default globalErrorHandler;
