import { User } from './user';
import { Tokens } from './tokens';

export class LoginResponse {
  constructor (public user: User, tokens: Tokens) {}
}
