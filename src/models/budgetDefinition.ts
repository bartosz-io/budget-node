import { Id } from './types';
import { Period } from './period';
import { Category } from './category';

export class BudgetDefinition {
  constructor(public id: Id,
    public period: Period,
    public category: Category,
    public maxExpenses: number) { }
}
