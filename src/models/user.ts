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
}
