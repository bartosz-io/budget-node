import { Router, Request, Response } from 'express';
import { ExpensesRepository } from './expenses.repository';
import { buildPeriodFromRequest } from '../../utils/controller.utils';
import { expenseBelongsToAccount } from './expenses.middleware';
import { readerOnlyReads } from '../auth/role.middleware';
import expensesValidator from './expenses.validator';
import { User } from '../../models/user';

export class ExpensesController {

  private readonly router: Router;

  constructor(private repository: ExpensesRepository) {
    this.router = Router();
    this.initRoutes();
  }

  public getRouter() {
    return this.router;
  }

  private initRoutes() {
    this.router.use('/expenses', readerOnlyReads());

    this.router.get('/expenses', (req: Request, res: Response) => {
      const user = req.user as User;
      const period = buildPeriodFromRequest(req);
      const categoryQuery = req.query.categoryName;

      if (!categoryQuery) {
        this.repository.getExpenses(user.accountId as string, period).then(expenses => res.json(expenses));
      } else {
        this.repository.getExpensesByCategory(user.accountId as string, period, categoryQuery as string)
          .then(expenses => res.json(expenses));
      }
    });

    this.router.post('/expenses', expensesValidator, (req: Request, res: Response) => {
      const user = req.user as User;
      const expense = req.body;
      expense.accountId = user.accountId;

      this.repository.createExpense(expense)
        .then(() => res.status(201).json());
    });

    this.router.put('/expenses/:id', expenseBelongsToAccount(), expensesValidator, (req: Request, res: Response) => {
      const user = req.user as User;
      const expense = req.body;
      expense.id = req.params.id;
      expense.accountId = user.accountId;

      this.repository.updateExpense(expense)
        .then(() => res.status(200).json());
    });

    this.router.delete('/expenses/:id', expenseBelongsToAccount(), (req: Request, res: Response) => {
      const expenseId = req.params.id;
      this.repository.deleteExpense(expenseId)
        .then(() => res.sendStatus(204));
    });

  }

}

