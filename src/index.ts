
import bodyParser = require('body-parser');
import cors = require('cors');
import morgan = require('morgan');
import express = require('express');
import passport from './app/auth/passport';
import routes from './routes';
import config from './config';

const app = express();
app.use(morgan(config.morganPattern));
app.use(bodyParser.json()); // try (express.json()) and (express.urlencoded({ extended: true }))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(cors());
app.use(routes);
app.listen(8080);