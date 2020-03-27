const randtoken = require('rand-token');
import bcrypt = require('bcryptjs');
import jwt = require('jsonwebtoken');

import CONFIG from '../../../config';
import { AuthService } from './auth.service';
import { UserRepository } from '../repositories/user.repository';
import { AccountRepository } from '../repositories/account.repository';
import { InMemoryAccountRepository } from '../repositories/in-memory/in-memory-account.repository';
import { InMemoryUserRepository } from '../repositories/in-memory/in-memory-user.repository';
import { ExpenseCategoriesRepository } from '../../shared/expense-categories/expense-categories.repository';
import { InMemoryExpenseCategoriesRepository } from '../../shared/expense-categories/in-memory-expense-categories.repository';
import { AuthRequest } from 'src/models/authRequest';
import { Tokens } from 'src/models/tokens';
import { User } from 'src/models/user';

// TODO provide configuration for repositories
const accountRepository: AccountRepository = new InMemoryAccountRepository();
const userRepository: UserRepository = new InMemoryUserRepository();
const expenseCategoriesRepository: ExpenseCategoriesRepository = new InMemoryExpenseCategoriesRepository();

// TODO in memory tokens store -> move to repository
const refreshTokens: { [key: string]: string } = {};

export class JwtAuthService implements AuthService {

  /*
    >>> Example code with explicit salt generation and hashing:

    bcrypt.genSalt(10).then(salt => {
      bcrypt.hash("password here", salt)
        .then(hash => console.log({ salt, hash }));
    });

    >>> results in:

    {
      salt: '$2a$10$f8.SA/84vLuIqChGu4Y/6u',
      hash: '$2a$10$f8.SA/84vLuIqChGu4Y/6uFZMdQsBSAnYjymCIrXLVsIihRiDN4kS'
    }

    >>> components concatenated: prefix + salt lenght + salt + hash

    $2a$ - bcrypt prefix
    $10$ - salt lenght
  */
  signup(signupRequest: AuthRequest): Promise<void> {
    const confirmationCode = randtoken.uid(256);
    /*
      HINT: Second param (10) is the salt length (implicit salt generation).
      Salt prevents from Rainbow Tables attack.
    */
    return bcrypt.hash(signupRequest.password, 10)
      .then(hashedPassword => accountRepository.createAccount({})
        .then(accountId => Promise.all([
          expenseCategoriesRepository.createDefaultExpensesCategories(accountId),
          userRepository.createUser({
            accountId: accountId,
            email: signupRequest.email,
            password: hashedPassword,
            role: 'OWNER',
            confirmed: false,
            confirmationCode
          })
        ])).then(() => {
          this.sendConfirmationEmail(signupRequest.email, confirmationCode);
          return Promise.resolve();
        })
      );
  }

  // mock email sending
  private sendConfirmationEmail(email: string, code: string) {
    const link = `${CONFIG.clientUrl}/confirm?email=${email}&code=${code}`;
    console.log(`>>> LINK >>>: ${link}`);
  }

  confirm(email: string, confirmationCode: string): Promise<void> {
    return userRepository.getUserByEmail(email).then(user => {
      if (user && !user.confirmed && user.confirmationCode === confirmationCode) {
        user.confirmed = true;
        user.confirmationCode = undefined;
      } else {
        return Promise.reject();
      }
    });
  }

  login(loginRequest: AuthRequest): Promise<Tokens> {
    const email = loginRequest.email;
    return userRepository.getUserByEmail(email).then(user => {
      if (user) {
        return bcrypt.compare(loginRequest.password, user.password!).then(match => {
          if (match && user.confirmed) {
            const token = signAccessToken(user);
            const refreshToken = randtoken.uid(256);
            refreshTokens[refreshToken] = email;
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
      const useremail = refreshTokens[refreshToken];
      return userRepository.getUserByEmail(useremail).then(user => {
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
    email: user.email,
    role: user.role
  };
  // 600 seconds = 10 minutes
  return jwt.sign(accessToken, CONFIG.secret, { expiresIn: 600 });
}
