
import { Router } from 'express';
import passport = require('passport');
import authCtrl from './app/auth/auth.controller';
import dashboardCtrl from './app/dashboard/dashboard.controller';
import expensesCtrl from './app/expenses/expenses.controller';
import settingsCtrl from './app/settings/settings.controller';
import sharedCtrl from './app/shared/shared.controller';

// TODO move to DI container
const authenticate = passport.authenticate('jwt', { session: false });

const api = Router();
api.use(dashboardCtrl);
api.use(expensesCtrl);
api.use(settingsCtrl);
api.use(sharedCtrl);

export default Router()
  .use('/auth', authCtrl)
  .use('/api', authenticate, api);
