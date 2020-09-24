const randtoken = require('rand-token');
import CONFIG from '../../../config';
import log from './../../../utils/logger';
import { UserRepository } from '../../auth/repositories/user.repository';
import { InMemoryUserRepository } from '../../auth/repositories/in-memory/in-memory-user.repository';
import { UserRole, Id } from '../../../models/types';
import { User } from '../../../models/user';

const userRepository: UserRepository = new InMemoryUserRepository();

const PATCHABLE_PROPS = ['tfa'];

export class AccountService {

  getUsers(accountId: string): Promise<User[]> {
    return userRepository.getUsers(accountId)
      .then(users => users.map(u => User.toSafeUser(u)));
  }

  createUser(userEmail: string, role: UserRole, accountId: Id): Promise<void> {
    const confirmationCode = randtoken.uid(256);
    return userRepository.createUser({
      accountId: accountId,
      email: userEmail,
      password: undefined,
      role: role,
      confirmed: false,
      confirmationCode,
      createdWith: 'password'
    }).then(() => {
      log.info('settings.create_user_successful', { email: userEmail });
      this.sendConfirmationEmail(userEmail, confirmationCode);
      return Promise.resolve();
    }).catch(error => {
      log.error('settings.create_user_failed', { email: userEmail });
      throw error; // rethrow the error for the controller
    });
  }

  patchUser(userId: Id, data: any, session?: any): Promise<void> {
    const filteredUser = Object.keys(data)
      .filter(property => PATCHABLE_PROPS.includes(property))
      .reduce((user: any, property) => {
        user[property] = data[property];
        return user;
      }, {});

    return userRepository.patchUser(userId, filteredUser)
      .then(patchedUser => {
        if (session && session.user && session.user.id === userId) {
          session.user = patchedUser;
        }
      })
  }

  deleteUser(userId: Id): Promise<void> {
    return userRepository.deleteUser(userId);
  }

  private sendConfirmationEmail(email: string, code: string) {
    const link = `${CONFIG.clientUrl}/password?email=${email}&code=${code}`;
    console.log(`>>> LINK >>>: ${link}`); // mock email sending :)
    log.info('settings.create_user_confirmation_email_sent', { email });
  }

}