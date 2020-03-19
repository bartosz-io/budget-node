import { Request, Response, NextFunction } from 'express';
import { ExpensesRepository } from './expenses.repository';
import { InMemoryExpensesRepository } from './in-memory-expenses.repository';
import { User } from '../../models/user';

const expensesRepository: ExpensesRepository = new InMemoryExpensesRepository();

export function expenseBelongsToAccount() {

  return function (req: Request, res: Response, next: NextFunction) {
    const user = req.user as User;
    const expenseId = req.params.id;
    
    // if `expenseId` is not in query params, then it will be "securely" provided by session or token
    if (!expenseId) {
      return next();
    }

    expensesRepository.getExpense(expenseId).then(expense => {
      if (expense.accountId === user.accountId) {
        return next();
      } else {
        res.status(401).json({ error: 'You are not authorized to perform this operation' });
        return next('Unauthorized');
      }
    }).catch(() => res.sendStatus(404));
  }

}