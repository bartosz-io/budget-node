import { Request, Response, NextFunction } from 'express';

export default () => (req: Request, res: Response, next: NextFunction) => {
  res.cookie('XSRF-Token', req.csrfToken());
  next();
}