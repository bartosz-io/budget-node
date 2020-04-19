import { CategoriesRepository } from './categories.repository';
import { Category } from '../../../models/category';
import { Id } from '../../../models/types';

export class InMemoryCategoriesRepository implements CategoriesRepository {

  getCategory(id: Id): Promise<Category> {
    const category = CATEGORIES.find(c => c.id === id);
    return new Promise((resolve, reject) => {
      category ? resolve(category) : reject();
    });
  }

  getCategories(accountId: Id): Promise<Category[]> {
    const categories = CATEGORIES.filter(category => category.accountId === accountId);
    return new Promise((resolve, reject) => {
      categories ? resolve(categories) : reject();
    });
  }

  createDefaultCategories(accountId: Id): Promise<void> {
    let nextId = CATEGORIES.length + 1;
    const newCategories = DEFAULT_CATEGORIES_NAMES.map(name => 
      new Category((nextId++).toString(), accountId, name)
    );
    CATEGORIES.push(...newCategories);
    return Promise.resolve();
  }

}

export const CATEGORIES: Category[] = [
  // accountId: 1
  new Category('1', '1', 'Food', ['mcdonalds']),
  new Category('2', '1', 'Shopping'),
  new Category('3', '1', 'Entertainment'),
  new Category('4', '1',  'Transport'),
  new Category('5', '1',  'Cloths'),

  // accountId: 2
  new Category('6', '2', 'Food'),
  new Category('7', '2', 'Shopping'),
  new Category('8', '2', 'Entertainment'),
];

const DEFAULT_CATEGORIES_NAMES: string[] = [
  'Food', 'Shopping', 'Entertainment'
];
