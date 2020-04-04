
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

const app = express();
app.use(express.static('../angular/dist/'));
app.use(session(config.sessionConfig));
app.use(morgan(config.morganPattern));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(cors());
app.use(csrf());
app.use(csrfCookieSetter());
app.use(routes);
app.listen(8080);