import { Id } from './types';
import { Account } from './account';

export class User {
  id?: Id;
  accountId?: Id;
  account?: Account;
  email?: string;
  password?: string;
  role?: 'OWNER' | 'READER';
  confirmed = false;
  confirmationCode? : string;

  static toSafeUser(user: User): User {
    const { id, accountId, email, role } = user;
    return  { id, accountId, email, role } as User;
  }

  static build(data: any): User {
    const user = new User();
    return Object.assign(user, data);
  }
}
