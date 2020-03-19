export class LoginRequest {
    constructor(public login: string, public password: string) { }

    static build(params: any): LoginRequest {
        return new LoginRequest(params.login, params.password);
    }
}