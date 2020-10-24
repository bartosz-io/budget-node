import { UserRepository } from '../user.repository';
import { Id, UserRole } from 'src/models/types';
import { User } from 'src/models/user';

export class InMemoryUserRepository implements UserRepository {

  getUserById(id: Id, attachAccount = false): Promise<User> {
    const user = USERS.find(user => user.id === id);
    if (attachAccount) {
      // TODO attach account in response
    }
    return new Promise((resolve, reject) => {
      user ? resolve(user) : reject();
    });
  }

  getUserByEmail(email: string): Promise<User> {
    const user = USERS.find(user => user.email === email);
    return new Promise((resolve, reject) => {
      user ? resolve(user) : reject();
    });
  }

  getUserByExternalId(provider: string, externalId: string): Promise<User> {
    const user = USERS.find(user => !!externalId && !!user.externalId && user.externalId[provider] === externalId);
    return new Promise((resolve, reject) => {
      user ? resolve(user) : reject();
    });
  }

  assertUserWithExternalIdNotExist(provider: string, externalId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.getUserByExternalId(provider, externalId)
        .then((user) => reject('User already exists'))
        .catch(() => resolve());
    });
  }

  getUsers(accountId: Id): Promise<User[]> {
    const users = USERS.filter(user => user.accountId === accountId)
    return Promise.resolve(users);
  }

  createUser(user: User): Promise<Id> {
    user.id = (USERS.length + 1).toString();
    USERS.push(user);
    return Promise.resolve(user.id);
  }

  deleteUser(id: Id): Promise<void> {
    USERS = USERS.filter(user => user.id !== id);
    return Promise.resolve();
  }

  patchUser(id: Id, data: User): Promise<User> {
    return this.getUserById(id)
      .then(userToPatch => Object.assign(userToPatch, data));
  }

}

let USERS: User[] = [
  {
    id: '1',
    email: 'admin@app.com',
    password: '$2y$10$k.58cTqd/rRbAOc8zc3nCupCC6QkfamoSoO2Hxq6HVs0iXe7uvS3e', // '123'
    role: 'ADMIN',
    confirmed: true,
    createdWith: 'password'
  },
  {
    id: '2',
    accountId: '1',
    email: 'bartosz@app.com',
    password: '$2y$10$k.58cTqd/rRbAOc8zc3nCupCC6QkfamoSoO2Hxq6HVs0iXe7uvS3e', // '123'
    role: 'OWNER',
    confirmed: true,
    createdWith: 'password',
    tfa: true,
    tfaSecret: 'FB2S2HQLIE2UIZQDGYLCMS3SNZMXQDSK'
  },
  {
    id: '3',
    accountId: '2',
    email: 'john@app.com',
    password: '$2y$10$k.58cTqd/rRbAOc8zc3nCupCC6QkfamoSoO2Hxq6HVs0iXe7uvS3e', // '123'
    role: 'OWNER',
    confirmed: true,
    createdWith: 'password'
  },
  {
    id: '4',
    accountId: '2',
    email: 'mike@app.com',
    password: '$2y$10$k.58cTqd/rRbAOc8zc3nCupCC6QkfamoSoO2Hxq6HVs0iXe7uvS3e', // '123'
    role: 'READER',
    confirmed: true,
    createdWith: 'password'
  },
  {
    id: '5',
    accountId: '1',
    email: 'hi@bartosz.io',
    role: 'OWNER',
    confirmed: true,
    externalId: {
      github: '8076187'
    },
    createdWith: 'github'
  }
];
