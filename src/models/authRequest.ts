import { Request } from 'express';

export class AuthRequest {
    
    constructor(public email: string, public password: string, public session?: any) { }

    static buildFromRequest(req: Request): AuthRequest {
        return new AuthRequest(req.body.email, req.body.password, req.session);
    }

}