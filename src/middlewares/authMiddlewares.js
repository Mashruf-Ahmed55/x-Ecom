import createHttpError from 'http-errors';

import { passportConfig_jwt } from '../config/passportConfig.js';
import userModel from '../models/user.model.js';
import returID from '../utils/index.js';

export const authenticateUser = async (req, res, next) => {
  passportConfig_jwt.authenticate(
    'jwt',
    { session: false },
    (err, user, info) => {
      if (err) {
        return next(createHttpError(401, 'Unauthorized'));
      }
      if (!user) {
        return next(
          createHttpError(404, 'Unauthorized! Please login fast and try again.')
        );
      }
      req.user = user;
      next();
    }
  )(req, res, next);
};

const protectAdmin = async (req, res, next) => {
  try {
    const userId = returID(req.user);
    const user = await userModel.findById(userId);
    if (!user || user.isAdmin !== 'ADMIN') {
      return next(createHttpError(403, 'Forbidden, not admin'));
    }
    next();
  } catch (error) {
    next(createHttpError('500', 'Internal Server Error'));
  }
};

export default protectAdmin;
