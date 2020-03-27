import { Router, Request, Response } from 'express';
import { BudgetRepository } from './budget.repository';
import { InMemoryBudgetRepository } from './in-memory-budget.repository';
import { buildPeriodFromRequest } from '../../utils/controller.utils';
import { User } from '../../models/user';

const router = Router();
const repository: BudgetRepository = new InMemoryBudgetRepository(); // TODO Use DI container

router.get('/budgets/:month/:year', function (req: Request, res: Response) {
  const user = req.user as User;
  repository.getBugdets(user.accountId as string, buildPeriodFromRequest(req))
    .then(budgets => res.json(budgets))
    .catch(() => res.status(404).json({msg: 'Budgets not found'}));
});

router.get('/budget-summary/:month/:year', function (req: Request, res: Response) {
  const user = req.user as User;
  repository.getBudgetSummary(user.accountId as string, buildPeriodFromRequest(req))
    .then(summary => res.json(summary))
    .catch(() => res.status(404).json({msg: 'Budget summary not found'}));
});

export default router;