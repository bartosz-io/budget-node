import { Router, Request, Response } from 'express';
import { AccountService } from './account.service';
import { denyOwnUserDeletion, userBelongsToAccount } from './account.middleware';
import { isOwner } from '../../auth/role.middleware';
import { User } from '../../../models/user';

const accountService = new AccountService();
const router = Router();

router.use('/users', isOwner());

router.get('/users', function (req: Request, res: Response) {
  const user = req.user as User;

  accountService.getUsers(user.accountId!)
    .then(users => res.json(users));
});

router.post('/users', function (req: Request, res: Response) {
  const currentUser = req.user as User;
  const newUser = req.body as User;

  accountService.createUser(newUser.email!, newUser.role!, currentUser.accountId)
    .then(() => res.status(201).json())
    .catch((err) => res.status(401).json({ msg: err ? err : 'Creating user failed' }));
});

router.delete('/users/:id', denyOwnUserDeletion(), userBelongsToAccount(), function (req: Request, res: Response) {
  const userToDeleteId = req.params.id;

  accountService.deleteUser(userToDeleteId)
    .then(() => res.sendStatus(204));
});

export default router;