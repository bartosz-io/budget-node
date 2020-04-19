import { Request, Response, NextFunction } from 'express';
import { CategoriesRepository } from './categories.repository';
import { InMemoryCategoriesRepository } from './in-memory-categories.repository';
import { User } from '../../../models/user';

const repository: CategoriesRepository = new InMemoryCategoriesRepository();

export function categoryBelongsToAccount() {

  return function (req: Request, res: Response, next: NextFunction) {
    const user = req.user as User;
    const categoryId = req.params.id;

    if (!categoryId) {
      return next();
    }

    repository.getCategory(categoryId).then(category => {
      if (category.accountId === user.accountId) {
        return next();
      } else {
        res.status(401).json({ error: 'You are not authorized to perform this operation' });
        return next('Unauthorized');
      }
    }).catch(() => res.sendStatus(404));
  }

}