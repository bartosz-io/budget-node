import { Id } from '../../../models/types';
import { ExpenseCategory } from '../../../models/expenseCategory';

export interface ExpenseCategoriesRepository {

  getExpenseCategory(id: Id): Promise<ExpenseCategory>;

  getExpensesCategories(accountId: Id): Promise<ExpenseCategory[]>;

  // TODO add missing operations

}