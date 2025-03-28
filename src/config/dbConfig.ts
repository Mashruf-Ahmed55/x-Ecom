import color from 'colors';
import * as mongoose from 'mongoose';
import { MongooseError } from 'mongoose';
import { envConfig } from './envConfig';

export default async function connectDb() {
  try {
    mongoose.connection.on('connected', () => {
      console.log(color.strikethrough('Connecting to MongoDB...'));
    });
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err.message);
      process.exit(1);
    });
    await mongoose.connect(envConfig.mongodbURI as string);
    console.log(color.green('MongoDB connected successfully'));
  } catch (err: unknown) {
    if (err instanceof MongooseError) {
      console.error('Failed to connect to MongoDB:', err.message);
    } else {
      console.error('An unexpected error occurred');
    }
    process.exit(1);
  }
}
