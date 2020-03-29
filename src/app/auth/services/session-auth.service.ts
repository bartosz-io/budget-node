import bcrypt = require('bcryptjs');
import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { UserRepository } from '../repositories/user.repository';
import { InMemoryUserRepository } from '../repositories/in-memory/in-memory-user.repository';
import { AuthRequest } from 'src/models/authRequest';
import { User } from 'src/models/user';

// TODO provide configuration for repositories
const userRepository: UserRepository = new InMemoryUserRepository();

export class SessionAuthService implements AuthService<User> {

  authenticate() {
    return (req: Request, res: Response, next: NextFunction) => {
      if (req.session && req.session.user) {
        req.user = req.session.user;
        next();
      } else {
        res.status(401).json({ error: 'You are not authorized to perform this operation' });
      }
    };
  }

  login(loginRequest: AuthRequest): Promise<User> {
    const email = loginRequest.email;
    return userRepository.getUserByEmail(email).then(user => {
      return bcrypt.compare(loginRequest.password, user.password!).then(match => {
        if (match && user.confirmed) {
          loginRequest.session.user = user;
          return Promise.resolve(user);
        } else {
          return Promise.reject();
        }
      });
    });
  }

  logout(session: any): Promise<void> {
    if (session && session.destroy) {
      return new Promise((resolve) => {
        session.destroy(() => resolve());
      });
    } else {
      return Promise.resolve();
    }
  }

  getCurrentUser(session: any): Promise<void> {
    if (session && session.user) {
      // we may want to strip out some properties here
      return Promise.resolve(session.user);
    } else {
      return Promise.resolve();
    }
  }

}