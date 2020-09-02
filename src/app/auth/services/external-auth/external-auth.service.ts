import { UserInfo } from './../../../../models/userInfo';
import { AuthProvider } from './../../../../models/user';
import { UserRepository } from '../../repositories/user.repository';
import { AccountRepository } from '../../repositories/account.repository';
import { CategoriesRepository } from '../../../settings/categories/categories.repository';
import { InMemoryUserRepository } from '../../repositories/in-memory/in-memory-user.repository';
import { InMemoryAccountRepository } from '../../repositories/in-memory/in-memory-account.repository';
import { InMemoryCategoriesRepository } from '../../../settings/categories/in-memory-categories.repository';
import { getExternalAuthProvider } from './external-auth.factory';
import log from '../../../../utils/logger';


// TODO provide configuration for repositories
const userRepository: UserRepository = new InMemoryUserRepository();
const accountRepository: AccountRepository = new InMemoryAccountRepository();
const categoriesRepository: CategoriesRepository = new InMemoryCategoriesRepository();

export class ExternalAuthService {

  login(provider: string, authCode: string, session: any): Promise<void> {
    const authProvider = getExternalAuthProvider(provider);
    return authProvider.getAccessToken(authCode, 'login').then((token: string) =>
      authProvider.getUserInfo(token).then(userInfo =>
        userRepository.getUserByExternalId(provider, userInfo.id).then(user => {
          session.user = user;
          log.info(`auth.${provider}.session_login_successful`, { user });
        }).catch(() => {
          log.error(`auth.${provider}.session_login_failed`, { userInfo });
          return Promise.reject('User not found');
        })
      )
    );
  }

  signup(provider: string, authCode: string, session: any): Promise<void> {
    const authProvider = getExternalAuthProvider(provider);
    return authProvider.getAccessToken(authCode, 'signup').then((token: string) =>
      authProvider.getUserInfo(token).then((userInfo: any) =>
        userRepository.assertUserWithExternalIdNotExist(provider, userInfo.id).then(() =>
          this.doSignup(provider, userInfo).then(() => {
            log.info(`auth.${provider}.signup_successful`, { email: userInfo.email });
            userRepository.getUserByExternalId(provider, userInfo.id).then(user => {
              session.user = user;
              log.info(`auth.${provider}.session_login_successful`, { user });
            });
          }).catch(error => {
            log.error(`auth.${provider}.signup_failed`, { email: userInfo.email });
            throw error;
          })
        )
      ));
  }

  private doSignup(provider: string, userInfo: UserInfo) {
    return accountRepository.createAccount({}).then(accountId => Promise.all([
      categoriesRepository.createDefaultCategories(accountId),
      userRepository.createUser({
        accountId: accountId,
        email: userInfo.email,
        role: 'OWNER',
        confirmed: true,
        createdWith: provider as AuthProvider,
        externalId: { [provider]: userInfo.id } // for example { github: 123 }
      })
    ]));
  }

}