import bcrypt = require('bcryptjs');
import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { OtpService } from './otp.service';
import { UserRepository } from '../repositories/user.repository';
import { AuthRequest } from 'src/models/authRequest';
import { User } from '../../../models/user';
import log from './../../../utils/logger';

export class SessionAuthService implements AuthService<User> {

  constructor(private otp: OtpService, private userRepository: UserRepository) {}

  authenticate() {
    return (req: Request, res: Response, next: NextFunction) => {
      if (req.session && req.session.user) {
        req.user = req.session.user;
        next();
      } else {
        res.statusCode = 401;
        res.json({ msg: 'You are not authorized to perform this operation' });
      }
    };
  }

  login(loginRequest: AuthRequest): Promise<User> {
    const email = loginRequest.email;
    return this.userRepository.getUserByEmail(email).then(user => {
      return bcrypt.compare(loginRequest.password, user.password!).then(match => {
        if (match && user.confirmed) {
          
          // IDEA: add login throttler in catch block
          return this.otp.checkOtpIfRequired(loginRequest, user).then(() => {
            loginRequest.session.user = user;
            log.info('auth.session_login_successful', { user });
            return Promise.resolve(User.toSafeUser(user));
          });

        } else {
          log.info('auth.session_login_failed', { user });
          return Promise.reject();
        }
      });
    });
  }

  logout(session: any): Promise<void> {
    if (session && session.destroy) {
      return new Promise((resolve, reject) => {
        session.destroy((error: any) => {
          if (!error) {
            log.info('auth.session_logout_successful', { user: session.user });
            resolve();
          } else {
            log.error('auth.session_destroy_failed', { error });
            reject(error);
          }
        })
      });
    } else {
      log.warn('auth.logout_session_not_found');
      return Promise.resolve();
    }
  }

  getCurrentUser(session: any): Promise<any> {
    if (session && session.user) {
      const user = User.build(session.user);
      const safeUser = User.toSafeUser(user);
      return Promise.resolve(safeUser);
    } else {
      return Promise.resolve();
    }
  }

}