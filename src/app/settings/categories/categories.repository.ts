import { Id } from 'src/models/types';
import { Category } from 'src/models/category';

export interface CategoriesRepository {

  getCategory(id: Id): Promise<Category>;

  getCategories(accountId: Id): Promise<Category[]>;

  createDefaultCategories(accountId: Id): Promise<void>;

}