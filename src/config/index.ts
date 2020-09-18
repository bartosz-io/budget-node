import path = require('path');
import rfs = require('rotating-file-stream');
import { MemoryStore, SessionOptions } from 'express-session';
import { secret } from './secret';

const jwtSecret = 'VERY_SECRET_KEY!'; // TODO change in prod
const cookieSecret = 'VERY_SECRET_KEY!'; // TODO change in prod

const externalAuth = {
  github: {
    authorizeUrl: 'https://github.com/login/oauth/authorize',
    accessTokenUrl: 'https://github.com/login/oauth/access_token',
    userInfoUrl: 'https://api.github.com/user',
    callbackURL: 'http://localhost:8080/api/auth/external/github/callback',
    scope: 'user:email',
    clientID: secret.github.clientID,
    clientSecret: secret.github.clientSecret
  },
  google: {
    authorizeUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    accessTokenUrl: 'https://oauth2.googleapis.com/token',
    userInfoUrl: 'https://openidconnect.googleapis.com/v1/userinfo',
    callbackURL: 'http://localhost:8080/api/auth/external/google/callback',
    scope: 'openid email profile',
    clientID: secret.google.clientID,
    clientSecret: secret.google.clientSecret
  },
  facebook: {
    authorizeUrl: 'https://www.facebook.com/dialog/oauth',
    accessTokenUrl: 'https://graph.facebook.com/oauth/access_token',
    userInfoUrl: 'https://graph.facebook.com/me',
    callbackURL: 'http://localhost:8080/api/auth/external/facebook/callback',
    scope: 'email',
    clientID: secret.facebook.clientID,
    clientSecret: secret.facebook.clientSecret
  }
}

const bunyanStreamSetting = process.env.LOGS || 'file';
const bunyanStdoutStream = { stream: process.stdout };
const bunyanFileStream = {
  type: 'rotating-file',
  path: path.join(process.cwd(), 'log', 'app'),
  period: '1d',
  count: 3
};

export default {
  jwtSecret,
  externalAuth,
  auth: 'session' as 'session' | 'jwt',
  loginThrottle: {
    maxFailures: 3,
    timeWindowInMinutes: 10
  },
  clientUrl: 'http://localhost:4200',
  sessionConfig: {
    name: 'session_id',
    secret: cookieSecret,
    saveUninitialized: true,
    resave: false,
    cookie: {
      sameSite: 'lax' as 'lax',
      maxAge: 3600000
    },
    store: new MemoryStore()
  } as SessionOptions,
  morganPattern: 'common',
  morganStream: rfs.createStream('access.log', {
    interval: '1d',
    path: path.join(process.cwd(), 'log')
  }),
  bunyanStream: bunyanStreamSetting === 'stdout' ? bunyanStdoutStream : bunyanFileStream
}