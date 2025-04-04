import 'dotenv/config';

const _config = {
  port: process.env.PORT,
  nodeEnv: process.env.NODE_ENV,
  mongodbURI: process.env.MONGODB_URI,
  jwtSecret_accessToken: process.env.JWT_SECRET_ACCESS_TOKEN,
  jwtSecret_refreshToken: process.env.JWT_SECRET_REFRESH_TOKEN,
  github_client_id: process.env.GITHUB_CLIENT_ID,
  github_client_secret: process.env.GITHUB_CLIENT_SECRET,
  google_client_id: process.env.GOOGLE_CLIENT_ID,
  google_client_secret: process.env.GOOGLE_CLIENT_SECRET,
  callBackUrl: process.env.CALL_BACK_URL,
};

export const envConfig = Object.freeze(_config);
