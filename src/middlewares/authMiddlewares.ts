import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import iUser from '../types/user.types';

import { passportConfig_jwt } from '../config/passportConfig';
import userModel from '../models/user.model';
import returID from '../utils';

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passportConfig_jwt.authenticate(
    'jwt',
    { session: false },
    (err: any, user: iUser, info: any) => {
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

const protectAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
