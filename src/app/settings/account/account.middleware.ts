import { Request, Response, NextFunction } from 'express';
import { UserRepository } from '../../auth/repositories/user.repository';
import { InMemoryUserRepository } from '../../auth/repositories/in-memory/in-memory-user.repository';
import { User } from '../../../models/user';

const repository: UserRepository = new InMemoryUserRepository();

export function userBelongsToAccount() {

  return function (req: Request, res: Response, next: NextFunction) {
    const currentUser = req.user as User;
    const requestedUserId = req.params.id;

    if (!requestedUserId) {
      return next();
    }

    repository.getUserById(requestedUserId).then(requestedUser => {
      if (requestedUser.accountId === currentUser.accountId) {
        return next();
      } else {
        res.status(403).json({ msg: 'You are not authorized to perform this operation' });
        return next('Unauthorized');
      }
    }).catch(() => res.sendStatus(404));
  }

}

export function denyOwnUserDeletion() {

  return function (req: Request, res: Response, next: NextFunction) {
    const user = req.user as User;
    const userToDeleteId = req.params.id;

    if (userToDeleteId && userToDeleteId === user.id && req.method.toUpperCase() === 'DELETE') {
      res.status(403).json({ msg: 'Cannot delete your own user' });
    } else {
      next();
    }
  }

}

export function allowOwnUserPatchOnly() {

  return function (req: Request, res: Response, next: NextFunction) {
    const user = req.user as User;
    const userToPatchId = req.params.id;

    if (userToPatchId && userToPatchId === user.id && req.method.toUpperCase() === 'PATCH') {
      next();
    } else {
      res.status(403).json({ msg: 'Operation not permitted' });
    }
  }

}