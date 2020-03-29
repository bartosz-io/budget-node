
import bodyParser = require('body-parser');
import cors = require('cors');
import morgan = require('morgan');
import express = require('express');
import session = require('express-session');
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
app.use(routes);
app.listen(8080);