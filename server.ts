import 'dotenv/config';
import app from './src/app';
import connectDb from './src/config/dbConfig';
import { envConfig } from './src/config/envConfig';

const startServer = async (): Promise<void> => {
  try {
    await connectDb();
    app.listen(envConfig.port, () => {
      console.log(`🚀 Server started on port ${envConfig.port}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer().catch((err) => {
  console.error(err);
});
