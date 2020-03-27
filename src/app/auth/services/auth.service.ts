import { AuthRequest } from 'src/models/authRequest';
import { Tokens } from 'src/models/tokens';

export interface AuthService {

    signup(signupRequest: AuthRequest): Promise<void>;

    confirm(email: string, confirmationCode: string): Promise<void>;
    
    login(loginRequest: AuthRequest): Promise<Tokens>;
    
    logout(refreshToken: string): void;
    
    refresh(refreshToken: string): Promise<Tokens>;

}