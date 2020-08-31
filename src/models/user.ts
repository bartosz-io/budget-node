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

  createdWith: AuthProvider = 'password';
  externalId?: {[keyof: string]: string};

  static toSafeUser(user: User): User {
    const { id, accountId, email, role, confirmed } = user;
    return  { id, accountId, email, role, confirmed } as User;
  }

  static build(data: any): User {
    const user = new User();
    return Object.assign(user, data);
  }
}
