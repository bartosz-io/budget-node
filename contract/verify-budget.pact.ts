import * as path from 'path';
import express = require('express');
import { Request, Response, NextFunction } from 'express';
import { Express } from 'express-serve-static-core';
import { Server } from 'http';
import { Verifier } from '@pact-foundation/pact'

import { DashboardController } from './../src/app/dashboard/dashboard.controller';
import { InMemoryBudgetRepository } from './../src/app/dashboard/in-memory-budget.repository';

describe('Budget Api provider verification', () => {

  const port = 8080;
  let app: Express;
  let server: Server;
  let givenRequest: (req: Request) => void;

  beforeAll((done) => {
    app = express();
    app.use(express.json());
    app.use((req: Request, _res: Response, next: NextFunction) => {
      givenRequest(req);
      next();
    });
    app.use(new DashboardController(new InMemoryBudgetRepository()).getRouter());

    server = app.listen(port, () => done());
  });

  afterAll(() => server.close());

  it('passes for the all interactions', async () => {

    givenRequest = (req) => {
      req.user = { accountId: '1' };
    }

    const options = {
      providerBaseUrl: 'http://localhost:8080',
      pactUrls: [path.resolve(__dirname, './../../pacts/budgetclient-budgetprovider.json')],
      // we can also point here to the Pact Broker to get the contracts
    }

    await new Verifier(options).verifyProvider();
  });

});
