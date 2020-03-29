import { RequestHandler } from 'express';
import { AuthRequest } from 'src/models/authRequest';

export interface AuthService<T> {

    authenticate(): RequestHandler;

    login(loginRequest: AuthRequest): Promise<T>;
    
    logout(session?: any): Promise<void>;

    getCurrentUser(session?: any): Promise<any>;
    
}