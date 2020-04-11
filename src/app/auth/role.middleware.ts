import { Request, Response, NextFunction } from 'express';
import { User } from './../../models/user';
import log from './../../utils/logger';

export function roleCheck() {

  return function (req: Request, res: Response, next: NextFunction) {
    const user = req.user as User;
    const userRole = user.role;

    if (userRole === 'READER' && req.method.toUpperCase() !== 'GET') {

      log.warn('auth.role_check_failure', { user });
      res.status(403).json({ error: 'You are not authorized to perform this operation' });
      return next('Unauthorized');

    } else {
      return next();
    }
  }

}