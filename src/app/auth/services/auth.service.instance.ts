import { OtpService } from './otp.service';
import { AuthService } from './auth.service';
import { JwtAuthService } from './jwt-auth.service';
import { SessionAuthService } from './session-auth.service';
import { UserRepository } from '../repositories/user.repository';
import { InMemoryUserRepository } from '../repositories/in-memory/in-memory-user.repository';
import config from './../../../config';

const userRepository: UserRepository = new InMemoryUserRepository();
const otp = new OtpService();

function getAuthService(): AuthService<any> {
  switch (config.auth) {
    case 'session':
      return new SessionAuthService(otp, userRepository);
    case 'jwt':
      return new JwtAuthService();
    default:
      throw 'AuthService not defined';
  }
}

export default getAuthService();

