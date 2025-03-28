import jwt from 'jsonwebtoken';
import { envConfig } from '../config/envConfig';

const generateAccessToken = (id: string) => {
  if (!envConfig.jwtSecret_accessToken) {
    throw new Error('JWT Secret not found');
  }
  return jwt.sign({ id }, envConfig.jwtSecret_accessToken, {
    expiresIn: '15m',
  });
};

const generateRefreshToken = async (id: string) => {
  if (!envConfig.jwtSecret_refreshToken) {
    throw new Error('JWT Secret not found');
  }
  return jwt.sign({ id }, envConfig.jwtSecret_refreshToken, {
    expiresIn: '15d',
  });
};

const generateAccessTokenAndRefreshToken = async (id: string) => {
  const accessToken = generateAccessToken(id);
  const refreshToken = await generateRefreshToken(id);
  return { accessToken, refreshToken };
};

const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, envConfig.jwtSecret_refreshToken!);
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
