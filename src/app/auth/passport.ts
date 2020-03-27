import { VerifiedCallback } from 'passport-jwt';
import { Strategy as JwtStrategy } from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';
import passport = require('passport');
import CONFIG from '../../config';

const passportOpts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: CONFIG.secret
};

passport.use(new JwtStrategy(passportOpts, function (jwtPayload: any, done: VerifiedCallback) {
  done(null, jwtPayload);
}));

// use for session-based auth
// passport.serializeUser(function (user: User, done: VerifiedCallback) {
//   done(null, user.id)
// });

export default passport;