import { ExpenseCategoriesRepository } from './expense-categories.repository';
import { ExpenseCategory } from '../../../models/expenseCategory';
import { Id } from 'src/models/types';

export class InMemoryExpenseCategoriesRepository implements ExpenseCategoriesRepository {

  getExpenseCategory(id: Id): Promise<ExpenseCategory> {
    const category = EXPENSE_CATEGORIES.find(c => c.id === id);
    return new Promise((resolve, reject) => {
      category ? resolve(category) : reject();
    });
  }

  getExpensesCategories(accountId: Id): Promise<ExpenseCategory[]> {
    const categories = EXPENSE_CATEGORIES.filter(category => category.accountId === accountId);
    return new Promise((resolve, reject) => {
      categories ? resolve(categories) : reject();
    });
  }

  createDefaultExpensesCategories(accountId: Id): Promise<void> {
    let nextId = EXPENSE_CATEGORIES.length + 1;
    const newCategories = DEFAULT_EXPENSE_CATEGORIES_NAMES.map(name => 
      new ExpenseCategory(nextId++, accountId, name)
    );
    EXPENSE_CATEGORIES.push(...newCategories);
    return Promise.resolve();
  }

}

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  // accountId: 1
  new ExpenseCategory('1', '1', 'Food', ['mcdonalds']),
  new ExpenseCategory('2', '1', 'Shopping'),
  new ExpenseCategory('3', '1', 'Entertainment'),
  new ExpenseCategory('4', '1',  'Transport'),
  new ExpenseCategory('5', '1',  'Cloths'),

  // accountId: 2
  new ExpenseCategory('6', '2', 'Food'),
  new ExpenseCategory('7', '2', 'Shopping'),
  new ExpenseCategory('8', '2', 'Entertainment'),
];

const DEFAULT_EXPENSE_CATEGORIES_NAMES: string[] = [
  'Food', 'Shopping', 'Entertainment'
];
