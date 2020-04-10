import { Request, Response, NextFunction } from 'express';
import log from './logger';

export default () => (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err && err.code == "EBADCSRFTOKEN") { // csurf error code
    log.info('auth.invalid_csrf_token');
    res.status(401).json({msg: 'Invalid CSRF Token - refresh the page!'});
  } else if (err) {
    next(err);
  } else {
    next();
  }
}