import { Router } from 'express';
import accountCtrl from './account/account.controller';
import categoriesCtrl from './categories/categories.controller';

const router = Router();

router.use(accountCtrl);
router.use(categoriesCtrl);

export default router;