import { Router, Request, Response } from 'express';
import { BudgetRepository } from './budget.repository';
import { buildPeriodFromRequest } from '../../utils/controller.utils';
import { User } from '../../models/user';

export class DashboardController {

  private readonly router: Router;

  constructor(private repository: BudgetRepository) {
    this.router = Router();
    this.initRoutes();
  }

  public getRouter() {
    return this.router;
  }

  private initRoutes() {

    this.router.get('/budgets', (req: Request, res: Response) => {
      const user = req.user as User;
      this.repository.getBugdets(user.accountId as string, buildPeriodFromRequest(req))
        .then(budgets => res.json(budgets))
        .catch(() => res.status(404).json({msg: 'Budgets not found'}));
    });
    
    this.router.get('/budget-summary', (req: Request, res: Response) => {
      const user = req.user as User;
      this.repository.getBudgetSummary(user.accountId as string, buildPeriodFromRequest(req))
        .then(summary => res.json(summary))
        .catch(() => res.status(404).json({msg: 'Budget summary not found'}));
    });
    
  }
}