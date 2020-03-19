import { Id } from 'src/models/types';
import { User } from 'src/models/user';

export interface AuthRepository {
    
    getUserById(id: Id, attachAccount?: boolean): Promise<User>;
 
    getUserByLogin(login: string): Promise<User>;
    
    saveUser(user: User): Promise<void>;

}