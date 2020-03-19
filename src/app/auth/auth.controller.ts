import { Router, Request, Response } from 'express';
import { JwtAuthService } from './jwt-auth.service';
import { LoginRequest } from '../../models/login-request';

const router = Router();
const authService = new JwtAuthService(); // TODO move as a strategy to config or DI container

router.post('/login', function (req: Request, res: Response) {
  const loginRequest = LoginRequest.build(req.body);
  authService.login(loginRequest).then(tokens => {
    res.json(tokens);
  }).catch(() => {
    res.status(401).json({msg: 'Wrong login or password'});
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