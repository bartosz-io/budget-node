import { Router, Request, Response } from 'express';
import { AccountService } from './account.service';
import { denyOwnUserDeletion, userBelongsToAccount, allowOwnUserPatchOnly } from './account.middleware';
import { OtpService } from './../../auth/services/otp.service';
import { hasRole } from '../../auth/role.middleware';
import { User } from '../../../models/user';

const accountService = new AccountService();
const otpService = new OtpService();
const router = Router();

router.use('/users', hasRole('OWNER'));

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

router.patch('/users/:id', allowOwnUserPatchOnly(), function (req: Request, res: Response) {
  const userToPatchId = req.params.id;
  const propsToPatch = req.body;

  accountService.patchUser(userToPatchId, propsToPatch, req.session)
    .then(() => res.status(201).json())
    .catch((err) => res.status(400).json({ msg: err ? err : 'Editing user failed' }));
});

router.delete('/users/:id', denyOwnUserDeletion(), userBelongsToAccount(), function (req: Request, res: Response) {
  const userToDeleteId = req.params.id;

  accountService.deleteUser(userToDeleteId)
    .then(() => res.sendStatus(204));
});

router.get('/secret', function (req: Request, res: Response) {
  const currentUser = req.user as User;
  if (currentUser.tfaSecret) {
    const keyuri = otpService.getOtpKeyUri(currentUser);
    res.status(200).json({ keyuri });
  } else {
    res.status(400).json({ msg: 'Error with generating code' });
  }
});

export default router;