import cors = require('cors');
import morgan = require('morgan');
import express = require('express');
import session = require('express-session');
import * as csrf from 'csurf';
import csrfCookieSetter from './utils/set-csrf-cookie';
import passport from './app/auth/passport';
import routes from './routes';
import config from './config';
import errorHandler from './utils/error-handler';
import serveIndex from './utils/serve-index';
import logger from './utils/logger';
import { User } from './models/user';

declare module 'express-session' {
  interface SessionData { user: User | null | undefined }
}

const app = express();
app.use(express.static('../angular/dist/'));
app.use(session(config.sessionConfig));
app.use(morgan(config.morganPattern, { stream: config.morganStream }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(cors());
app.use(csrf());
app.use(csrfCookieSetter());
app.use(errorHandler());
app.use(logger.initialize());
app.use(routes);
app.get('*', serveIndex());
app.listen(8080, () => logger.info('main.app_start'));