export class AuthRequest {
    constructor(public email: string, public password: string) { }

    static build(params: any): AuthRequest {
        return new AuthRequest(params.email, params.password);
    }
}