import { Router, Request, Response } from 'express';
import { JwtAuthService } from './services/jwt-auth.service';
import { AuthRequest } from '../../models/authRequest';

const router = Router();
const authService = new JwtAuthService(); // TODO move as a strategy to config or DI container

router.post('/signup', function (req: Request, res: Response) {
  const signupRequest = AuthRequest.build(req.body);
  authService.signup(signupRequest).then(() => {
    res.sendStatus(204);
  }).catch(() => {
    res.status(400).json({msg: 'Signup failed'});
  });
});

router.get('/confirm', function (req: Request, res: Response) {
  let email = req.query.email;
  let confirmationCode = req.query.code;
  authService.confirm(email, confirmationCode).then(() => {
    res.sendStatus(204);
  }).catch(() => {
    res.status(400).json({msg: 'Confirmation failed'});
  });
});



router.post('/login', function (req: Request, res: Response) {
  const loginRequest = AuthRequest.build(req.body);
  authService.login(loginRequest).then(tokens => {
    res.json(tokens);
  }).catch(() => {
    res.status(401).json({msg: 'Wrong email or password'});
  });
});

router.post('/logout', function (req: Request, res: Response) {
  const refreshToken = req.body.refreshToken;
  authService.logout(refreshToken);
  res.sendStatus(204);
});

if (authService instanceof JwtAuthService) {

  router.post('/refresh', function (req: Request, res: Response) {
    const refreshToken = req.body.refreshToken;
    authService.refresh(refreshToken).then(tokens => {
      res.json(tokens);
    }).catch(() => {
      res.status(401).json({msg: 'You have been logged out'});
    });
  });

}

export default router;