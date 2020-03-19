import { Request, Response, NextFunction } from 'express';
import { ExpenseCategoriesRepository } from './expense-categories.repository';
import { InMemoryExpenseCategoriesRepository } from './in-memory-expense-categories.repository';
import { User } from '../../../models/user';

const repository: ExpenseCategoriesRepository = new InMemoryExpenseCategoriesRepository();

export function expenseCategoryBelongsToAccount() {

  return function (req: Request, res: Response, next: NextFunction) {
    const user = req.user as User;
    const categoryId = req.params.id;

    // if `categoryId` is not in query params, then it will be "securely" provided by session or token
    if (!categoryId) {
      return next();
    }

    repository.getExpenseCategory(categoryId).then(category => {
      if (category.accountId === user.accountId) {
        return next();
      } else {
        res.status(401).json({ error: 'You are not authorized to perform this operation' });
        return next('Unauthorized');
      }
    }).catch(() => res.sendStatus(404));
  }

}