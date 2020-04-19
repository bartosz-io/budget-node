import { AccountRepository } from '../account.repository';
import { Account } from 'src/models/account';
import { Id } from 'src/models/types';

export class InMemoryAccountRepository implements AccountRepository {

    createAccount(account: Account): Promise<Id> {
        account.id = (ACCOUNTS.length + 1).toString();
        ACCOUNTS.push(account);
        return Promise.resolve(account.id);
    }

}

const ACCOUNTS: Account[] = [
    {
        id: '1'
    },
    {
        id: '2'
    }
]
