import { ExpensesRepository } from './expenses.repository';
import { CATEGORIES } from '../settings/categories/in-memory-categories.repository';
import { Id } from '../../models/types';
import { Period } from '../../models/period';
import { Expense } from '../../models/expense';

export class InMemoryExpensesRepository implements ExpensesRepository {

  getExpense(id: Id): Promise<Expense> {
    let expense = EXPENSES.find(expense => expense.id === id);
    this.attachCategory(expense);
    return new Promise((resolve, reject) => {
      expense ? resolve(expense) : reject();
    });
  }

  getExpenses(accountId: Id, period: Period): Promise<Expense[]> {
    const expenses = EXPENSES.filter(expense => period.equals(expense.period) && expense.accountId === accountId);
    expenses.forEach(e => this.attachCategory(e));
    return new Promise((resolve, reject) => {
      expenses ? resolve(expenses) : reject();
    });
  }

  getExpensesByCategory(accountId: Id, period: Period, category: string): Promise<Expense[]> {
    const expenses = EXPENSES.filter(
      expense => period.equals(expense.period) &&
        expense.accountId === accountId &&
        expense.category && expense.category.name.toLowerCase().includes(category));
    return new Promise((resolve, reject) => {
      expenses ? resolve(expenses) : reject();
    });
  }

  createExpense(expense: Expense): Promise<void> {
    expense.id = (EXPENSES.length + 1).toString();
    EXPENSES.push(expense);
    return Promise.resolve();
  }

  updateExpense(expense: Expense): Promise<void> {
    return this.getExpense(expense.id)
      .then(expenseToUpdate => {
        Object.assign(expenseToUpdate, expense);
      });
  }

  deleteExpense(id: Id): Promise<void> {
    EXPENSES = EXPENSES.filter(expense => expense.id !== id);
    return Promise.resolve();
  }

  private attachCategory(expense: Expense | undefined) {
    if (expense) {
      expense.category = CATEGORIES.find(category => category.id === expense.categoryId);;
    }
  }

}

const period = new Period(3, 2020);
const date1 = new Date('2020-03-02');
const date2 = new Date('2020-03-11');

let EXPENSES: Expense[] = [
  new Expense('1', '1', 21.4, date1, period, '1', 'McDonalds'),
  new Expense('2', '1', 31.9, date2, period, '3', 'CinemaCity'),
  new Expense('3', '2', 21.5, date2, period, '8', 'CinemaX'),
  new Expense('4', '2', 11.5, date1, period, '6', 'KFC'),
];
