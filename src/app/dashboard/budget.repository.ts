import { Id } from '../../models/types';
import { Period } from '../../models/period';
import { Budget } from '../../models/budget';
import { BudgetSummary } from '../../models/budgetSummary';

export interface BudgetRepository {
    
    getBugdets(accountId: Id, period: Period): Promise<Budget[]>;

    getBudgetSummary(accountId: Id, period: Period): Promise<BudgetSummary>;

}