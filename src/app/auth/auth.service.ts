import { LoginRequest } from 'src/models/login-request';
import { Tokens } from 'src/models/tokens';

export interface AuthService {

    login(loginRequest: LoginRequest): Promise<Tokens>;
    
    logout(refreshToken: string): void;
    
    refresh(refreshToken: string): Promise<Tokens>;

}