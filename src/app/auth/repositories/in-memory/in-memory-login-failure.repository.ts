import { LoginFailureRepository } from '../login-failure.repository';
import { LoginFailure } from './../../../../models/login.failure';

export class InMemoryLoginFailureRepository implements LoginFailureRepository {

  getLastFailures(userEmail: string, number: number): Promise<LoginFailure[]> {
    const ascendingByTime = (f1: LoginFailure, f2: LoginFailure) => f1.datetime.getTime() - f2.datetime.getTime();
    const lastFailures = LOGIN_FAILURES.sort(ascendingByTime).slice(-number);
    return Promise.resolve(lastFailures);
  }
  registerFailedLogin(userEmail: string, datetime: Date): Promise<void> {
    LOGIN_FAILURES.push(new LoginFailure(userEmail, datetime));
    return Promise.resolve();
  }
  
}

const LOGIN_FAILURES: LoginFailure[] = [];