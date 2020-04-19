const randtoken = require('rand-token');
import bcrypt = require('bcryptjs');
import CONFIG from '../../../config';
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

  requestRecovery(email: string) {
    const recoveryCode = randtoken.uid(256);
    return userRepository.getUserByEmail(email).then(user => {
      if (user && user.confirmed) {
        
        user.recovery = {
          code: recoveryCode,
          requested: new Date()
        }
        this.sendRecoveryEmail(email, recoveryCode);
        log.info('auth.password_recovery_request_successful', { user });

      } else {
        log.warn('auth.password_recovery_request_failed', { user });
        return Promise.reject();
      }
    });
  }

  recover(email: string, recoveryCode: string, password: string) {

    return userRepository.getUserByEmail(email).then(user => {
      if (user && user.confirmed && user.recovery && user.recovery.code === recoveryCode) {
        
        // IDEA: use 'user.recovery.requested' date to limit the time validity of recovery code
        return bcrypt.hash(password, 10).then(hashedPassword => {
          user.password = hashedPassword;
          user.recovery = undefined;
          log.info('auth.password_recovery_successful', { user });
        });

      } else {
        log.warn('auth.password_recovery_failed', { user });
        return Promise.reject();
      }
    });

  }

  private sendRecoveryEmail(email: string, code: string) {
    const link = `${CONFIG.clientUrl}/password?email=${email}&code=${code}&recovery=true`;
    console.log(`>>> LINK >>>: ${link}`); // mock email sending :)
    log.info('auth.password_recovery_email_sent', { email });
  }

}