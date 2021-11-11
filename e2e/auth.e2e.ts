import { Server } from 'http';
import * as request from 'supertest';
import { buildProdServer, getRandomPort } from './utils';

describe('Authorization', () => {

  let server: Server;
  let port: number;
  let apiUrl: string;
  let host = 'http://localhost';
  
  beforeAll((done) => {
    port = getRandomPort();
    apiUrl = `${host}:${port}/api`;
    server = buildProdServer(port, () => done());
  });

  afterAll(() => server.close());

  it('fails to login with invalid password', (done) => {

    request(apiUrl)
      .post('/auth/login')
      .send({ email: 'bartosz@app.com',  password: 'invalid' })
      .expect(401) // HTTP 401 Unauthorized
      .then(() => done());

  });

  it('fails to get data without authorization', (done) => {

    request(apiUrl)
      .get('/expenses')
      .expect(401) // HTTP 401 Unauthorized
      .then(() => done());

  });

  it('logs in with valid password', (done) => {

    request(apiUrl)
      .post('/auth/login')
      .send({ email: 'bartosz@app.com', password: '123' })
      .expect(200) // HTTP 200 OK
      .then(() => done());

  });

});