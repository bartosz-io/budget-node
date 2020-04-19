import { Id } from 'src/models/types';
import { User } from 'src/models/user';

export interface UserRepository {
    
    getUserById(id: Id, attachAccount?: boolean): Promise<User>;

    getUserByEmail(email: string): Promise<User>;
    
    getUsers(accountId: Id): Promise<User[]>;

    createUser(user: User): Promise<Id>;

    deleteUser(id: Id): Promise<void>;

}