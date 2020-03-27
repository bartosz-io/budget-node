import { Id } from 'src/models/types';
import { ExpenseCategory } from 'src/models/expenseCategory';

export interface ExpenseCategoriesRepository {

  getExpenseCategory(id: Id): Promise<ExpenseCategory>;

  getExpensesCategories(accountId: Id): Promise<ExpenseCategory[]>;

  createDefaultExpensesCategories(accountId: Id): Promise<void>;

}