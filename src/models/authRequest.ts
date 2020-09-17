import { Request } from 'express';

export class AuthRequest {
    
    constructor(
        public email: string, 
        public password: string,
        public otp?: string,
        public session?: any) { }

    static buildFromRequest(req: Request): AuthRequest {
        return new AuthRequest(
            req.body.email,
            req.body.password,
            req.body.otp,
            req.session);
    }

}