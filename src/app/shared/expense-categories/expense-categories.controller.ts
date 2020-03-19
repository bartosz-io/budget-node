import { Router, Request, Response } from 'express';
import { ExpenseCategoriesRepository } from './expense-categories.repository';
import { InMemoryExpenseCategoriesRepository } from './in-memory-expense-categories.repository';
import { expenseCategoryBelongsToAccount } from './expense-categories.middleware';
import { User } from '../../../models/user';

const repository: ExpenseCategoriesRepository = new InMemoryExpenseCategoriesRepository(); // TODO use DI container
const router = Router();

// TODO implement role checks in all routes
router.use(expenseCategoryBelongsToAccount())

router.get('/expense-categories/:id', function (req: Request, res: Response) {
  repository.getExpenseCategory(req.params.id)
    .then(category => res.json(category));
});

router.get('/expense-categories', function (req: Request, res: Response) {
  const user = req.user as User;

  repository.getExpensesCategories(user.accountId as string)
    .then(categories => res.json(categories));
});

export default router;