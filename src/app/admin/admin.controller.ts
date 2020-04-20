import { Router, Request, Response } from 'express';
import { hasRole } from '../auth/role.middleware';
import { AdminService } from './admin.service';

const router = Router();
const adminService = new AdminService();

router.use(hasRole('ADMIN'));

router.get('/sessions', function (req: Request, res: Response) {
  adminService.getActiveSessions().then(sessions => {
    res.json(sessions);
  });
});

router.delete('/sessions/:sessionId', function (req: Request, res: Response) {
  const sessionId = req.params.sessionId;
  adminService.destroySession(sessionId).then(() => res.sendStatus(204));
});

export default router;
