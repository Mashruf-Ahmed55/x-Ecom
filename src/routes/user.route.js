import { Router } from 'express';
import passport from 'passport';
import {
  accessTokenCreate,
  blockUser,
  createUser,
  deleteUser,
  getAllUsers,
  getUser,
  loginUser,
  logoutUser,
  unBlockUser,
  updateUser,
} from '../controllers/user.controller.js';
import protectAdmin, {
  authenticateUser,
} from '../middlewares/authMiddlewares.js';
import {
  validateSchemaSignIn,
  validateSchemaSignUp,
} from '../middlewares/validateSchema.js';

const userRouter = Router();

// @ts-ignore
userRouter.route('/register').post(validateSchemaSignUp, createUser);
// @ts-ignore
userRouter.route('/login').post(validateSchemaSignIn, loginUser);
userRouter.route('/refresh-token').post(accessTokenCreate);
userRouter.route('/logout').get(authenticateUser, logoutUser);

// GITHUB
userRouter.get(
  '/auth/github',
  passport.authenticate('github', {
    session: false,
    scope: ['user:email'],
  })
);

userRouter.get(
  '/auth/github/callback',
  passport.authenticate('github', {
    failureRedirect: `http://localhost:5173/login`,
    session: false,
  }),
  function (req, res) {
    const user = req.user;

    res
      .cookie('accessToken', user.accessToken, {
        maxAge: 15 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      })
      .cookie('refreshToken', user.refreshToken, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      })
      .redirect(`http://localhost:5173/success`);
  }
);

// GOOGLE
userRouter.get(
  '/auth/google',
  passport.authenticate('google', { session: false, scope: ['profile'] })
);

userRouter.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: 'http://localhost:5173/login',
    session: false,
  }),
  function (req, res) {
    const user = req.user;

    res
      .cookie('accessToken', user.accessToken, {
        maxAge: 15 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      })
      .cookie('refreshToken', user.refreshToken, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      })
      .redirect(`http://localhost:5173/success`);
  }
);

userRouter.route('/update').put(authenticateUser, updateUser);
userRouter.route('/me').get(authenticateUser, getUser);
userRouter.route('/all-users').get(authenticateUser, protectAdmin, getAllUsers);
userRouter.route('/delete').delete(authenticateUser, protectAdmin, deleteUser);
userRouter.route('/block/:id').post(authenticateUser, protectAdmin, blockUser);
userRouter
  .route('/un-block/:id')
  .post(authenticateUser, protectAdmin, unBlockUser);

export default userRouter;
