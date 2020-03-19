import { Id } from '../../models/types';
import { Period } from '../../models/period';
import { Expense } from '../../models/expense';

export interface ExpensesRepository {

  getExpense(id: Id): Promise<Expense>;

  getExpenses(accountId: Id, period: Period): Promise<Expense[]>;

  getExpensesByCategory(accountId: Id, period: Period, category: string): Promise<Expense[]>;

  createExpense(expense: Expense): Promise<void>;

  updateExpense(expense: Expense): Promise<void>;

  deleteExpense(id: Id): Promise<void>;

}