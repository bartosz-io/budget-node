import { AuthRepository } from './auth.repository';
import { Id } from '../../models/types';
import { User } from '../../models/user';
import { Account } from '../../models/account';

export class InMemoryAuthRepository implements AuthRepository {

    getUserById(id: Id, attachAccount = false): Promise<User> {
        const user = USERS.find(user => user.id === id);
        if (attachAccount) {
            // TODO attach account in response
        }
        return new Promise((resolve, reject) => {
            user ? resolve(user) : reject();
        });
    }

    getUserByLogin(login: string): Promise<User> {
        const user = USERS.find(user => user.login === login);
        return new Promise((resolve, reject) => {
            user ? resolve(user) : reject();
        });
    }

    saveUser(user: User): Promise<void> {
        throw new Error("Method not implemented.");
    }

}

const USERS: User[] = [
    {
        id: '1',
        accountId: '1',
        login: 'bartosz',
        password: '$2y$10$k.58cTqd/rRbAOc8zc3nCupCC6QkfamoSoO2Hxq6HVs0iXe7uvS3e', // '123'
        role: 'OWNER'
    },
    {
        id: '2',
        accountId: '2',
        login: 'john',
        password: '$2y$10$k.58cTqd/rRbAOc8zc3nCupCC6QkfamoSoO2Hxq6HVs0iXe7uvS3e', // '123'
        role: 'OWNER'
    }
];

const ACCOUNTS: Account[] = [
    {
        id: '1'
    },
    {
        id: '2'
    }
]
