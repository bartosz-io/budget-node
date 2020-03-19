import { Router } from 'express';
import expenseCategories from './expense-categories/expense-categories.controller';

const router = Router();

router.use(expenseCategories);

export default router;