import { Id } from 'src/models/types';
import { User } from 'src/models/user';

export interface UserRepository {
    
    getUserById(id: Id, attachAccount?: boolean): Promise<User>;

    getUserByEmail(email: string): Promise<User>;

    getUserByExternalId(provider: string, externalId: string): Promise<User>;

    assertUserWithExternalIdNotExist(provider: string, externalId: string): Promise<void>;

    getUsers(accountId: Id): Promise<User[]>;

    createUser(user: User): Promise<Id>;

    patchUser(id: Id, user: User): Promise<User>;

    deleteUser(id: Id): Promise<void>;

}