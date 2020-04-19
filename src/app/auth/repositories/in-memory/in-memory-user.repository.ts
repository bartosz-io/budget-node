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

}

let USERS: User[] = [
  {
    id: '1',
    accountId: '1',
    email: 'bartosz@app.com',
    password: '$2y$10$k.58cTqd/rRbAOc8zc3nCupCC6QkfamoSoO2Hxq6HVs0iXe7uvS3e', // '123'
    role: 'OWNER',
    confirmed: true
  },
  {
    id: '2',
    accountId: '2',
    email: 'john@app.com',
    password: '$2y$10$k.58cTqd/rRbAOc8zc3nCupCC6QkfamoSoO2Hxq6HVs0iXe7uvS3e', // '123'
    role: 'OWNER',
    confirmed: true
  },
  {
    id: '3',
    accountId: '2',
    email: 'mike@app.com',
    password: '$2y$10$k.58cTqd/rRbAOc8zc3nCupCC6QkfamoSoO2Hxq6HVs0iXe7uvS3e', // '123'
    role: 'READER',
    confirmed: true
  }
];
