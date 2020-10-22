import { Router, Request, Response } from 'express';
import { AuthRequest } from '../../models/authRequest';
import { SignupService } from './services/signup.service';
import { PasswordService } from './services/password.service';
import externalAuthCtrl from './external-auth.controller';
import authService from './services/auth.service.instance';
import validator from './auth.validator';

const router = Router();
const signupService = new SignupService();
const passwordService = new PasswordService();

router.post('/signup', validator, function (req: Request, res: Response) {
  const signupRequest = AuthRequest.buildFromRequest(req);
  signupService.signup(signupRequest).then(() => {
    res.sendStatus(204);
  }).catch(() => {
    res.status(400).json({msg: 'Signup failed'});
  });
});

router.post('/confirm', function (req: Request, res: Response) {
  let email = req.body.email;
  let confirmationCode = req.body.code;
  signupService.confirm(email, confirmationCode).then(() => {
    res.sendStatus(204);
  }).catch(() => {
    res.status(400).json({msg: 'Confirmation failed'});
  });
});

router.post('/setup', function (req: Request, res: Response) {
  let email = req.body.email;
  let code = req.body.code;
  let password = req.body.password;

  passwordService.setup(email, code, password).then(() => {
    res.sendStatus(204);
  }).catch(() => {
    res.status(400).json({msg: 'Setting password failed'});
  });
});

router.get('/recover', function (req: Request, res: Response) {
  let email = req.query.email;

  passwordService.requestRecovery(email).then(() => {
    res.sendStatus(204);
  }).catch(() => {
    res.status(400).json({msg: 'Recovery failed'});
  });
});

router.post('/recover', function (req: Request, res: Response) {
  let email = req.body.email;
  let code = req.body.code;
  let password = req.body.password;

  passwordService.recover(email, code, password).then(() => {
    res.sendStatus(204);
  }).catch(() => {
    res.status(400).json({msg: 'Recovery failed failed'});
  });
});

router.post('/login', function (req: Request, res: Response) {
  const loginRequest = AuthRequest.buildFromRequest(req);
  authService.login(loginRequest).then(result => {
    res.json(result);
  }).catch((err) => {
    res.status(401).json({msg: err ? err : 'Login failed'});
  });
});

router.get('/logout', function (req: Request, res: Response) {
  authService.logout(req.session).then(() => {
    res.sendStatus(204);
  });
});

router.get('/user', function (req: Request, res: Response) {
  authService.getCurrentUser(req.session).then((user) => {
    res.status(200).json(user);
  });
});

router.use('/external', externalAuthCtrl);

export default router;