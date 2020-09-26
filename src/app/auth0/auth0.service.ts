import { User } from '../../models/user';
import { Id, UserRole } from '../../models/types';
import { AccountRepository } from '../auth/repositories/account.repository';
import { CategoriesRepository } from '../settings/categories/categories.repository';
import { InMemoryAccountRepository } from '../auth/repositories/in-memory/in-memory-account.repository';
import { InMemoryCategoriesRepository } from '../settings/categories/in-memory-categories.repository';
import { Auth0Api } from './auth0.api';
import log from '../../utils/logger';

// TODO provide configuration for repositories
const accountRepository: AccountRepository = new InMemoryAccountRepository();
const categoriesRepository: CategoriesRepository = new InMemoryCategoriesRepository();
const auth0 = new Auth0Api();

export class Auth0Service {

  private readonly USER_DATA = 'https://budget.com/userdata';

  login(authCode: string, session: any): Promise<void> {

    return auth0.getIdToken(authCode)
      .then(token => this.getUserFromToken(token))
      .then(user => this.doLogin(user, session))
      .catch((error) => {
        log.error(`auth0.session_login_failed`, { error: error.toString() });
        throw error;
      });

  }

  private doLogin(user: any, session: any): Promise<void> {
    return this.signupIfNeeded(user, session).then((signedUser) => {
      session.user = signedUser ? this.normalizeUserFromApi(signedUser) : user;
      log.info(`auth0.session_login_successful`, { user });
    });
  }

  private signupIfNeeded(user: User, session: any): Promise<User | void> {
    if (this.isUserSignedUp(user)) {
      return Promise.resolve();
    } else {

      let accountId: Id;

      return accountRepository.createAccount({})
        .then(createdAccountId => { accountId = createdAccountId })
        .then(() => categoriesRepository.createDefaultCategories(accountId))
        .then(() => this.setUserAccountAndRole(user.id, accountId, 'OWNER'))
        .then(signedUser => { 
          log.info(`auth0.signup_successful`, { user: signedUser });
          return signedUser;
        });

    }
  }

  private setUserAccountAndRole(userId: Id, accountId: Id, role: UserRole) {
    return auth0.getAccessToken()
      .then(token => auth0.updateUser(token, userId, {
        app_metadata: {
          accountId, role,
        }
      }))
  }

  private isUserSignedUp(user: any) {
    return user[this.USER_DATA]
      && user[this.USER_DATA].role
      && user[this.USER_DATA].accountId;
  }

  private getUserFromToken(token: string) {
    const rawUser = token.split('.')[1];
    const user = JSON.parse(Buffer.from(rawUser, 'base64').toString());
    return this.normalizeUserFromToken(user);
  }

  private normalizeUserFromToken(user: any): User {
    const userdata = user[this.USER_DATA];
    Object.assign(user, userdata, { id: user.sub });
    return User.build(user);
  }

  private normalizeUserFromApi(user: any): User {
    const userdata = user.app_metadata;
    Object.assign(user, userdata, { id: user.user_id });
    return User.build(user);
  }

}
