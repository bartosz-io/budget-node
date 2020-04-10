import { AuthService } from './auth.service';
import { JwtAuthService } from './jwt-auth.service';
import { SessionAuthService } from './session-auth.service';
import config from './../../../config';

function getAuthService(): AuthService<any> {
  switch (config.auth) {
    case 'session':
      return new SessionAuthService;
    case 'jwt':
      return new JwtAuthService();
    default:
      throw 'AuthService not defined';
  }
}

export default getAuthService();

