import { Account } from 'src/models/account';
import { Id } from 'src/models/types';

export interface AccountRepository {
    
    createAccount(account: Account): Promise<Id>;

}