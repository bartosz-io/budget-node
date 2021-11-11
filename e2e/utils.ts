import express = require('express');
import session = require('express-session');
import morgan = require('morgan');
import cors = require('cors');
import passport = require('passport');
import { Server } from 'http';
import * as request from 'supertest';

import errorHandler from './../src/utils/error-handler';
import logger from './../src/utils/logger';
import routes from './../src/routes';
import config from './../src/config';

export function buildProdServer(port: number, callback: () => void): Server {

  const app = express();
  app.use(session(config.sessionConfig));
  app.use(morgan(config.morganPattern, { stream: config.morganStream }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(passport.initialize());
  app.use(cors());
  app.use(errorHandler());
  app.use(logger.initialize());
  app.use(routes);

  return app.listen(port, () => {
    console.log('started production-like server on port: ' + port);
    callback();
  });

}

export function getRandomPort() {
  return 3000 + Math.floor((5000 * Math.random()))
}

export function login(apiUrl: string) {
  return request(apiUrl)
    .post('/auth/login')
    .send({ email: 'bartosz@app.com', password: '123' })
    .expect(200)
    .then((response) => response.body.jwt);
}