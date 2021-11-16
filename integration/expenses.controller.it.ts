import express = require('express');
import { Request, Response, NextFunction } from 'express';
import { Express } from 'express-serve-static-core';
import { Server } from 'http';
import * as request from 'supertest';

import { Period } from '../src/models/period';
import { Expense } from './../src/models/expense';
import { ExpensesController } from './../src/app/expenses/expenses.controller';
import { ExpensesRepository } from './../src/app/expenses/expenses.repository';

describe('ExpensesController', () => {
  
  const fakeExpense: Expense = {
    accountId: '1',
    value: 100,
    datetime: new Date(1, 1, 2021),
    period: new Period(10, 2021),
    categoryId: '1',
    counterparty: 'fake'
  }

  let expenseRepoStub: ExpensesRepository = {
    getExpense: jest.fn(() => Promise.resolve(fakeExpense)),
    getExpenses: jest.fn(() => Promise.resolve([fakeExpense])),
    getExpensesByCategory: jest.fn(() => Promise.resolve([fakeExpense])),
    createExpense: jest.fn(() => Promise.resolve()),
    updateExpense: jest.fn(() => Promise.resolve()),
    deleteExpense: jest.fn(() => Promise.resolve())
  }

  let app: Express;
  let server: Server;
  let givenRequest: (req: Request) => void;
  const port = 3000;

  beforeAll((done) => {
    app = express();
    app.use(express.json());
    app.use((req: Request, _res: Response, next: NextFunction) => {
      givenRequest(req);
      next();
    });
    app.use(new ExpensesController(expenseRepoStub).getRouter());
    
    server = app.listen(port, () => done());
  });

  afterAll(() => server.close());

  it('returns error 500 when the user role is missing', (done) => {
    // given
    givenRequest = (req) => {
      req.user = { role: undefined };
    }

    // when & then
    request(`http://localhost:${port}`)
      .get('/expenses')
      .expect('Content-Type', /json/)
      .expect(500)
      .then(() => done());
  });

  it('returns expenses for the READER role', (done) => {
    // given
    givenRequest = (req) => {
      req.user = { role: 'READER' };
    }

    // when & then
    request(`http://localhost:${port}`)
      .get('/expenses')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body[0].id).toEqual(fakeExpense.id);
        expect(response.body[0].accountId).toEqual(fakeExpense.accountId);
        expect(response.body[0].value).toEqual(fakeExpense.value);
        done();
      });
  });

  it('returns 403 error when the READER tries to POST expense', (done) => {
    // given
    givenRequest = (req) => {
      req.user = { role: 'READER' };
    }

    // when & then
    request(`http://localhost:${port}`)
      .post('/expenses')
      .send(fakeExpense)
      .expect('Content-Type', /json/)
      .expect(403)
      .then((response) => {
        expect(response.body.msg).toContain('not authorized');
        done();
      });
  });

  it('returns 201 success code when the OWNER tries to POST expense', (done) => {
    // given
    givenRequest = (req) => {
      req.user = { role: 'OWNER' };
    }

    // when & then
    request(`http://localhost:${port}`)
      .post('/expenses')
      .send(fakeExpense)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201)
      .then((response) => {
        expect(response.body).toBeFalsy();
        done();
      });
  });

});