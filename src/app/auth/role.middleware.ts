import { Request, Response, NextFunction } from 'express';
import { User } from './../../models/user';
import { ROLES, UserRole } from '../../models/types';
import log from './../../utils/logger';

export function readerOnlyReads() {

  return function (req: Request, res: Response, next: NextFunction) {
    const user = req.user as User;
    
    if (!isRoleFound(user)) {
      handleRoleNotFound(user, res);
    } else if (user.role && user.role.toUpperCase() === 'READER' && req.method.toUpperCase() !== 'GET') {
      log.warn('auth.reader_check_failure', { user });
      res.status(403).json({ msg: 'You are not authorized to perform this operation' });
      next('Unauthorized');
    } else {
      next();
    }
  }

}

export function hasRole(roleToCheck: UserRole) {

  return function (req: Request, res: Response, next: NextFunction) {
    const user = req.user as User;

    if (!isRoleFound(user)) {
      handleRoleNotFound(user, res);
    } else if (user.role !== roleToCheck) {
      log.warn('auth.role_check_failure', { roleToCheck, user });
      res.status(403).json({ msg: 'You are not authorized to perform this operation' });
    } else {
      next();
    }
  }

}

function isRoleFound(user: User) {
  return user && ROLES.find(r => r === user.role);
}

function handleRoleNotFound(user: User, res: Response) {
  log.error('auth.role_not_found', { user });
  res.status(500).json({ msg: 'System could not find your permissions' });
}
