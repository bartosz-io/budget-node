const randtoken = require('rand-token');
import bcrypt = require('bcryptjs');
import jwt = require('jsonwebtoken');
import CONFIG from '../../../config';
import passport from '../passport';
import { AuthService } from './auth.service';
import { UserRepository } from '../repositories/user.repository';
import { InMemoryUserRepository } from '../repositories/in-memory/in-memory-user.repository';
import { AuthRequest } from 'src/models/authRequest';
import { Token } from 'src/models/token';
import { User } from 'src/models/user';

// TODO provide configuration for repositories
const userRepository: UserRepository = new InMemoryUserRepository();

export class JwtAuthService implements AuthService<Token> {

  authenticate() {
    return passport.authenticate('jwt', { session: false });
  }

  login(loginRequest: AuthRequest): Promise<Token> {
    const email = loginRequest.email;
    return userRepository.getUserByEmail(email).then(user => {
      return bcrypt.compare(loginRequest.password, user.password!).then(match => {
        if (match && user.confirmed) {
          const token = createSignedToken(user);
          return { jwt: token };
        } else {
          return Promise.reject();
        }
      });
    });
  }

  logout() {
    return Promise.resolve();
  }

  getCurrentUser(): Promise<void> {
    return Promise.resolve();
  }

}

function createSignedToken(user: User) {
  const payload = User.toSafeUser(user);
  return jwt.sign(payload, CONFIG.jwtSecret,
    { expiresIn: 600 }); // 600 seconds = 10 minutes
}
