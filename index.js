import app from './src/app.js';
import connectDb from './src/config/dbConfig.js';
import { envConfig } from './src/config/envConfig.js';

const startServer = async () => {
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
