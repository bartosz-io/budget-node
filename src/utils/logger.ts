import bunyan = require('bunyan');
import { Request, Response, NextFunction } from 'express';
import { User } from './../models/user';
import CONFIG from './../config';

const serializers = {
  user: (user: User) => User.toSafeUser(user),
  req: (req: Request) => {
    return {
      ip: req.ip,
      method: req.method,
      url: req.url
      // add necessary properties to log
    }
  }
}

class Logger {

  private static req?: Request;
  private static bunyanLogger = bunyan.createLogger(
    {
      name: 'budget',
      streams: [CONFIG.bunyanStream],
      serializers
    }
  )

  static initialize() {
    return (req: Request, res: Response, next: NextFunction) => {
      this.req = req;
      next();
    }
  }

  static info(msg: string, fields?: any) {
    fields = { ...fields, req: this.req };
    this.bunyanLogger.info(fields, msg);
  }

  static warn(msg: string, fields?: any) {
    fields = { ...fields, req: this.req };
    this.bunyanLogger.warn(fields, msg);
  }

  static error(msg: string, fields?: any) {
    fields = { ...fields, req: this.req };
    this.bunyanLogger.error(fields, msg);
  }

}

export default Logger;