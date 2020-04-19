import { Router, Request, Response } from 'express';
import { CategoriesRepository } from './categories.repository';
import { InMemoryCategoriesRepository } from './in-memory-categories.repository';
import { categoryBelongsToAccount } from './categories.middleware';
import { User } from '../../../models/user';

const repository: CategoriesRepository = new InMemoryCategoriesRepository(); // TODO use DI container
const router = Router();

// TODO implement role checks in all routes

router.get('/expense-categories/:id', categoryBelongsToAccount(), function (req: Request, res: Response) {
  repository.getCategory(req.params.id)
    .then(category => res.json(category));
});

router.get('/expense-categories', function (req: Request, res: Response) {
  const user = req.user as User;

  repository.getCategories(user.accountId as string)
    .then(categories => res.json(categories));
});

export default router;