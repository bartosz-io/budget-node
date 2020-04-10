
import bodyParser = require('body-parser');
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
import logger from './utils/logger';

const app = express();
app.use(express.static('../angular/dist/'));
app.use(session(config.sessionConfig));
app.use(morgan(config.morganPattern, { stream: config.morganStream }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(cors());
app.use(csrf());
app.use(csrfCookieSetter());
app.use(errorHandler());
app.use(logger.initialize());
app.use(routes);
app.listen(8080, () => logger.info('main.app_start'));