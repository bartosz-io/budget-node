import { Router, Request, Response } from 'express';
import { SignupService } from './services/signup.service';
import { AuthRequest } from '../../models/authRequest';
import CONFIG from './../../config';

const router = Router();
const authService = CONFIG.authService;
const signupService = new SignupService();

router.post('/signup', function (req: Request, res: Response) {
  const signupRequest = AuthRequest.buildFromRequest(req);
  signupService.signup(signupRequest).then(() => {
    res.sendStatus(204);
  }).catch(() => {
    res.status(400).json({msg: 'Signup failed'});
  });
});

router.get('/confirm', function (req: Request, res: Response) {
  let email = req.query.email;
  let confirmationCode = req.query.code;
  signupService.confirm(email, confirmationCode).then(() => {
    res.sendStatus(204);
  }).catch(() => {
    res.status(400).json({msg: 'Confirmation failed'});
  });
});

router.post('/login', function (req: Request, res: Response) {
  const loginRequest = AuthRequest.buildFromRequest(req);
  authService.login(loginRequest).then(result => {
    res.json(result);
  }).catch(() => {
    res.status(401).json({msg: 'Wrong email or password'});
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

export default router;