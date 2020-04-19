import bcrypt = require('bcryptjs');
import { UserRepository } from '../repositories/user.repository';
import { InMemoryUserRepository } from '../repositories/in-memory/in-memory-user.repository';
import log from './../../../utils/logger';

const userRepository: UserRepository = new InMemoryUserRepository();

export class PasswordService {

  setup(email: string, confirmationCode: string, password: string): Promise<void> {
    return userRepository.getUserByEmail(email).then(user => {
      if (user && !user.confirmed && user.confirmationCode === confirmationCode) {
        
        return bcrypt.hash(password, 10).then(hashedPassword => {
          user.password = hashedPassword;
          user.confirmed = true;
          user.confirmationCode = undefined;
          log.info('auth.password_setup_successful', { user });
        });

      } else {
        log.warn('auth.password_setup_failed', { user });
        return Promise.reject();
      }
    });
  }

}