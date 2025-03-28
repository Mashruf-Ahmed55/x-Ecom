import mongoose from 'mongoose';
import { envConfig } from './envConfig.js';

export default async function connectDb() {
  try {
    mongoose.connection.on('connected', () => {
      console.log('Connecting to MongoDB...');
    });
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err.message);
      process.exit(1);
    });
    await mongoose.connect(envConfig.mongodbURI);
    console.log('MongoDB connected successfully');
  } catch (err) {
    if (err) {
      console.error('Failed to connect to MongoDB:', err.message);
    } else {
      console.error('An unexpected error occurred');
    }
    process.exit(1);
  }
}
