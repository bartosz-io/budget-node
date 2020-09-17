import { Id, UserRole } from './types';
import { Account } from './account';

export type AuthProvider = 'password' | 'github';

export class User {
  id?: Id;
  accountId?: Id;
  account?: Account;
  email?: string;
  password?: string;
  role?: UserRole;
  confirmed = false;
  confirmationCode? : string;
  recovery?:  {
    code: string;
    requested: Date;
  };

  tfa? = false;
  tfaSecret?: string;
  createdWith: AuthProvider = 'password';
  externalId?: {[keyof: string]: string};

  static toSafeUser(user: User): User {
    const { id, accountId, email, role, confirmed, tfa } = user;
    return  { id, accountId, email, role, confirmed, tfa } as User;
  }

  static build(data: any): User {
    const user = new User();
    return Object.assign(user, data);
  }
}
