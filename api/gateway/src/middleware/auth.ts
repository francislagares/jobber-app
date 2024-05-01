import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

import {
  AuthPayload,
  BadRequestError,
  NotAuthorizedError,
} from '@francislagares/jobber-shared';

import { config } from '@gateway/config';

class AuthMiddleware {
  public verifyUser(req: Request, _res: Response, next: NextFunction) {
    if (!req.session?.jwt) {
      throw new NotAuthorizedError(
        'Token is not available. Please log in again.',
        'Gateway Service verifyUser() method error',
      );
    }

    try {
      const payload: AuthPayload = verify(
        req.session.jwt,
        `${config.JWT_TOKEN}`,
      ) as AuthPayload;

      req.currentUser = payload;
    } catch (error) {
      throw new NotAuthorizedError(
        'Token is not available. Please log in again.',
        'GatewayService verifyUser() method invalid session error',
      );
    }
    next();
  }

  public checkAuthentication(req: Request, _res: Response, next: NextFunction) {
    if (!req.currentUser) {
      throw new BadRequestError(
        'Authentication is required to access this route.',
        'GatewayService verifyUser() method error',
      );
    }
    next();
  }
}

export const authMiddleware: AuthMiddleware = new AuthMiddleware();
