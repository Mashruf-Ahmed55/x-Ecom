import jwt from 'jsonwebtoken';
import { envConfig } from '../config/envConfig.js';

const generateAccessToken = (id) => {
  if (!envConfig.jwtSecret_accessToken) {
    throw new Error('JWT Secret not found');
  }
  return jwt.sign({ id }, envConfig.jwtSecret_accessToken, {
    expiresIn: '15m',
  });
};

const generateRefreshToken = async (id) => {
  if (!envConfig.jwtSecret_refreshToken) {
    throw new Error('JWT Secret not found');
  }
  return jwt.sign({ id }, envConfig.jwtSecret_refreshToken, {
    expiresIn: '15d',
  });
};

const generateAccessTokenAndRefreshToken = async (id) => {
  const accessToken = generateAccessToken(id);
  const refreshToken = await generateRefreshToken(id);
  return { accessToken, refreshToken };
};

const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, envConfig.jwtSecret_refreshToken);
  } catch (error) {
    return null;
  }
};

export {
  generateAccessToken,
  generateAccessTokenAndRefreshToken,
  generateRefreshToken,
  verifyRefreshToken,
};
