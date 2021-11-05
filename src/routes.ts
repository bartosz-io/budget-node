
import { Router } from 'express';
import authCtrl from './app/auth/auth.controller';
import auth0Ctrl from './app/auth0/auth0.controller';
import adminCtrl from './app/admin/admin.controller';
import { DashboardController } from './app/dashboard/dashboard.controller';
import { ExpensesController } from './app/expenses/expenses.controller';
import settingsCtrl from './app/settings/settings.controller';
import authService from './app/auth/services/auth.service.instance';

import { InMemoryBudgetRepository } from './app/dashboard/in-memory-budget.repository';
import { InMemoryExpensesRepository } from './app/expenses/in-memory-expenses.repository';

const dashboardCtrl = new DashboardController(new InMemoryBudgetRepository());
const expensesCtrl = new ExpensesController(new InMemoryExpensesRepository());

const api = Router()
  .use(dashboardCtrl.getRouter())
  .use(expensesCtrl.getRouter())
  .use(settingsCtrl);

export default Router()
  .use('/api/auth', authCtrl)
  .use('/api/auth0', auth0Ctrl)
  .use('/api/admin', authService.authenticate(), adminCtrl)
  .use('/api', authService.authenticate(), api);
