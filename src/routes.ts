
import { Router } from 'express';
import CONFIG from './config';
import authCtrl from './app/auth/auth.controller';
import dashboardCtrl from './app/dashboard/dashboard.controller';
import expensesCtrl from './app/expenses/expenses.controller';
import settingsCtrl from './app/settings/settings.controller';
import sharedCtrl from './app/shared/shared.controller';

const authService = CONFIG.authService;

const api = Router();
api.use(dashboardCtrl);
api.use(expensesCtrl);
api.use(settingsCtrl);
api.use(sharedCtrl);

export default Router()
  .use('/auth', authCtrl)
  .use('/api', authService.authenticate(), api);
