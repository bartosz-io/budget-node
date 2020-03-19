const randtoken = require('rand-token');
import bcrypt = require('bcryptjs');
import jwt = require('jsonwebtoken');
import CONFIG from '../../config';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import { InMemoryAuthRepository } from './in-memory-auth.repository';
import { LoginRequest } from 'src/models/login-request';
import { Tokens } from 'src/models/tokens';
import { User } from 'src/models/user';

// use InMemoryAuthRepository
// TODO provide configuration for this
const authRepository: AuthRepository = new InMemoryAuthRepository();

// in memory tokens store
// TODO move to repository
const refreshTokens: { [key: string]: string } = {};

export class JwtAuthService implements AuthService {

  login(loginRequest: LoginRequest): Promise<Tokens> {
    const login = loginRequest.login;
    return authRepository.getUserByLogin(login).then(user => {
      if (user) {
        return bcrypt.compare(loginRequest.password, user.password!).then(match => {
          if (match) {
            const token = signAccessToken(user);
            const refreshToken = randtoken.uid(256);
            refreshTokens[refreshToken] = login;
            return { jwt: token, refreshToken };
          } else {
            return Promise.reject();
          }
        });
      } else {
        return Promise.reject();
      }
    });
  }

  logout(refreshToken: string) {
    if (refreshToken in refreshTokens) {
      delete refreshTokens[refreshToken];
    }
  }

  // TODO issue a new refresh token every time refreshing happens
  refresh(refreshToken: string): Promise<Tokens> {
    if (refreshToken in refreshTokens) {
      const userLogin = refreshTokens[refreshToken];
      return authRepository.getUserByLogin(userLogin).then(user => {
        if (user) {
          const token = signAccessToken(user);
          return { jwt: token, refreshToken };
        } else {
          return Promise.reject();
        }
      });
    }
    else {
      return Promise.reject();
    }
  }
}

function signAccessToken(user: User) {
  const accessToken = { 
    id: user.id,
    accountId: user.accountId,
    login: user.login,
    role: user.role 
  };
  return jwt.sign(accessToken, CONFIG.secret, { expiresIn: 600 });
}
