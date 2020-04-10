import { LoginFailureRepository } from '../repositories/login-failure.repository';
import { InMemoryLoginFailureRepository } from '../repositories/in-memory/in-memory-login-failure.repository';
import config from './../../../config';

// TODO provide configuration for repositories
let loginFailures: LoginFailureRepository = new InMemoryLoginFailureRepository();

export class LoginThrottler {

  private readonly MAX_FAILURES = config.loginThrottle.maxFailures;
  private readonly TIME_WINDOW = config.loginThrottle.timeWindowInMinutes;

  isLoginBlocked(userEmail: string): Promise<boolean> {
    return loginFailures.getLastFailures(userEmail, this.MAX_FAILURES).then(failures => {

      if (failures.length >= this.MAX_FAILURES) {
        const currentTime = new Date();
        const oldestFailure =  failures.reduce((a, b) => a.datetime.getTime() < b.datetime.getTime() ? a : b);
        
        if (oldestFailure.datetime.getTime() >= currentTime.getTime() - this.TIME_WINDOW * 1000 * 60) {
          return Promise.resolve(true);
        }
      }
      
      return Promise.resolve(false);
    });
  }

  registerLoginFailure(userEmail: string): Promise<void> {
    return loginFailures.registerFailedLogin(userEmail, new Date());
  }

}
