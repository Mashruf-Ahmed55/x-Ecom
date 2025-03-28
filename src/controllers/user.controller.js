import bcrypt from 'bcryptjs';
import expressAsyncHandler from 'express-async-handler';
import createHttpError from 'http-errors';
import userModel from '../models/user.model.js';
import {
  generateAccessToken,
  generateAccessTokenAndRefreshToken,
  verifyRefreshToken,
} from '../utils/generateToken.js';
import returID from '../utils/index.js';

// Create a new user
// POST /api/v1/users/register
export const createUser = expressAsyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });

    if (user) {
      return next(createHttpError(400, 'User already exists'));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    const { accessToken, refreshToken } =
      await generateAccessTokenAndRefreshToken(String(newUser._id));
    res
      .status(200)
      .cookie('accessToken', accessToken, {
        maxAge: 15 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      })
      .cookie('refreshToken', refreshToken, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      })
      .json({
        success: true,
        message: 'User register in successfully',
        data: newUser,
      });
  } catch (error) {
    next(createHttpError(500, 'Internal server error'));
  }
});

// Login a user
// POST /api/v1/users/login
export const loginUser = expressAsyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({
      email,
    });

    if (!user) {
      return next(createHttpError(401, 'Invalid email or password'));
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return next(createHttpError(401, 'Invalid email or password'));
    }
    const { accessToken, refreshToken } =
      await generateAccessTokenAndRefreshToken(String(user._id));
    const newUser = await userModel.findById(user._id).select('-password');
    res
      .status(200)
      .cookie('accessToken', accessToken, {
        maxAge: 15 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      })
      .cookie('refreshToken', refreshToken, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      })
      .json({
        success: true,
        message: 'User logged in successfully',
        data: newUser,
      });
  } catch (error) {
    next(createHttpError(500, 'Internal Server Error'));
  }
});

// Refresh TOken
// POST /api/v1/users/refresh-token
export const accessTokenCreate = expressAsyncHandler(async (req, res, next) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    return next(createHttpError(401, 'Unauthorized, no refresh token'));
  }
  try {
    const decode = verifyRefreshToken(token);
    if (!decode) {
      return next(createHttpError('403', 'Forbidden, invalid refresh token'));
    }
    const payload = decode;
    const newAccesToken = generateAccessToken(payload.id);

    res
      .status(200)
      .cookie('accessToken', newAccesToken, {
        maxAge: 15 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      })
      .json({
        success: true,
        accessToken: newAccesToken,
      });
  } catch (error) {
    next(createHttpError(500, 'Internal Server Error'));
  }
});

// Logout a user
// GET /api/v1/users/logout
export const logoutUser = expressAsyncHandler(async (req, res, next) => {
  try {
    res
      .status(200)
      .clearCookie('accessToken')
      .clearCookie('refreshToken')
      .json({
        success: true,
        message: 'User logged out successfully',
      });
  } catch (error) {
    next(createHttpError(500, 'Internal Server Error'));
  }
});

// Get all users
// GET /api/v1/users/getAllUsers
export const getAllUsers = expressAsyncHandler(async (req, res, next) => {
  try {
    const users = await userModel.find({});
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(createHttpError(500, 'Internal Server Error'));
  }
});

// Get a user by ID
// GET /api/v1/users/me
export const getUser = expressAsyncHandler(async (req, res, next) => {
  const userId = returID(req.user);
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return next(createHttpError(404, 'User not found'));
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(createHttpError(500, 'Internal Server Error'));
  }
});

// Get a user by ID
// DELETE /api/v1/users/delete
export const deleteUser = expressAsyncHandler(async (req, res, next) => {
  const userId = returID(req.user);
  try {
    const user = await userModel.findByIdAndDelete(userId);
    if (!user) {
      return next(createHttpError(404, 'User not found'));
    }
    res
      .status(200)
      .json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    next(createHttpError(500, 'Internal Server Error'));
  }
});

// Update a user by ID
// PUT /api/v1/users/update
export const updateUser = expressAsyncHandler(async (req, res, next) => {
  const userId = returID(req.user);
  const { firstName, lastName, email } = req.body;
  try {
    const user = await userModel.findByIdAndUpdate(
      userId,
      {
        firstName: firstName,
        lastName: lastName,
        email: email,
      },
      {
        new: true,
      }
    );
    if (!user) {
      return next(createHttpError(404, 'User not found'));
    }
    res
      .status(200)
      .json({ success: true, message: 'User Updated successfully' });
  } catch (error) {
    next(createHttpError(500, 'Internal Server Error'));
  }
});

// Block a user by ID
// POST /api/v1/users/block/:id
export const blockUser = expressAsyncHandler(async (req, res, next) => {
  const userId = req.params.id;
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return next(createHttpError(404, 'User not found'));
    }
    user.isBlocked = true;
    await user.save();
    res
      .status(200)
      .json({ success: true, message: 'User Blocked successfully' });
  } catch (error) {
    next(createHttpError(500, 'Internal Server Error'));
  }
});

// Unblock a user by ID
// POST /api/v1/users/un-block/:id
export const unBlockUser = expressAsyncHandler(async (req, res, next) => {
  const userId = req.params.id;
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return next(createHttpError(404, 'User not found'));
    }
    user.isBlocked = false;
    await user.save();
    res
      .status(200)
      .json({ success: true, message: 'User UnBlocked successfully' });
  } catch (error) {
    next(createHttpError(500, 'Internal Server Error'));
  }
});
