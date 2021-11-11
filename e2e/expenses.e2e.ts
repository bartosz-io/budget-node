import { Server } from 'http';
import * as request from 'supertest';
import * as faker from 'faker';

import { buildProdServer, getRandomPort, login } from './utils';
import { Expense } from '../src/models/expense';
import { Period } from '../src/models/period';

describe('Expenses', () => {

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

  it('login => get expenses', (done) => {

    login(apiUrl).then((jwt) => {
      request(apiUrl)
        .get('/expenses/?month=3&year=2020')
        .set('Authorization', `Bearer ${jwt}`)
        .expect(200) // HTTP 200 OK
        .then((response) => {
          expect(response.body.length).toEqual(2);
          expect(response.body[0].id).toEqual('1');
          expect(response.body[1].id).toEqual('2');
          expect(response.body[0].value).toEqual(expect.any(Number));
          expect(response.body[1].value).toEqual(expect.any(Number));
          done();
        })
    });

  });

  it('login => add expense => get expenses', (done) => {

    const period = new Period(10, 2021);
    const newExpense: Expense = {
      accountId: '1',
      value: faker.datatype.number(9999),
      // months are indexed from 0, so 9 is actually October (10th month)
      datetime: faker.date.between(new Date(2021, 9, 1), new Date(2021, 9, 31)),
      period: period,
      categoryId: '1',
      counterparty: faker.company.companyName()
    }

    login(apiUrl).then((jwt) => {

      // add expense
      request(apiUrl)
        .post('/expenses')
        .send(newExpense)
        .set('Authorization', `Bearer ${jwt}`)
        .expect(201) // HTTP 201 Created
        .then(() => {

          // get expenses
          request(apiUrl)
            .get(`/expenses?month=${period.month}&year=${period.year}`)
            .set('Authorization', `Bearer ${jwt}`)
            .expect(200) // HTTP 200 OK
            .then((response) => {
              expect(new Date(response.body[0].datetime)).toEqual(newExpense.datetime);
              expect(response.body[0].counterparty).toEqual(newExpense.counterparty);
              expect(response.body[0].accountId).toEqual(newExpense.accountId);
              expect(response.body[0].period).toEqual(newExpense.period);
              expect(response.body[0].value).toEqual(newExpense.value);
              done();
            })
        })
    });
  });

});

