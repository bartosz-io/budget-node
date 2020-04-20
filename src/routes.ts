
import { Router } from 'express';
import authCtrl from './app/auth/auth.controller';
import adminCtrl from './app/admin/admin.controller';
import dashboardCtrl from './app/dashboard/dashboard.controller';
import expensesCtrl from './app/expenses/expenses.controller';
import settingsCtrl from './app/settings/settings.controller';
import authService from './app/auth/services/auth.service.instance';

const api = Router();
api.use(dashboardCtrl);
api.use(expensesCtrl);
api.use(settingsCtrl);

export default Router()
  .use('/auth', authCtrl)
  .use('/admin', authService.authenticate(), adminCtrl)
  .use('/api', authService.authenticate(), api);
