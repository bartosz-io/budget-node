import { AuthService } from './../app/auth/services/auth.service';
import { JwtAuthService } from './../app/auth/services/jwt-auth.service';
import { SessionAuthService } from './../app/auth/services/session-auth.service';

const jwtSecret = 'VERY_SECRET_KEY!'; // TODO change in prod
const cookieSecret = 'VERY_SECRET_KEY!'; // TODO change in prod (used to sign cookie session id)

const authService: AuthService<any> = new SessionAuthService();

export default {
  jwtSecret,
  clientUrl: 'http://localhost:4200',
  morganPattern: ':method :url :status :res[content-length] - :response-time ms',
  sessionConfig: {
    secret: cookieSecret,
    saveUninitialized: true,
    resave: false,
    cookie: {
      sameSite: false,
      maxAge: 3600000
    }
  },
  authService,
}