
import { Router } from 'express';
import authCtrl from './app/auth/auth.controller';
import auth0Ctrl from './app/auth0/auth0.controller';
import adminCtrl from './app/admin/admin.controller';
import dashboardCtrl from './app/dashboard/dashboard.controller';
import expensesCtrl from './app/expenses/expenses.controller';
import settingsCtrl from './app/settings/settings.controller';
import authService from './app/auth/services/auth.service.instance';

const api = Router()
  .use(dashboardCtrl)
  .use(expensesCtrl)
  .use(settingsCtrl);

export default Router()
  .use('/api/auth', authCtrl)
  .use('/api/auth0', auth0Ctrl)
  .use('/api/admin', authService.authenticate(), adminCtrl)
  .use('/api', authService.authenticate(), api);
