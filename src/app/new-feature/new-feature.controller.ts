import { Router, Request, Response } from 'express';

export class NewFeatureController {

  private readonly router: Router;

  constructor() {
    this.router = Router();
    this.initRoutes();
  }

  public getRouter() {
    return this.router;
  }

  private initRoutes() {

    this.router.get('/budgets', (_req: Request, res: Response) => {
      res.status(200).json({msg: 'This is a new feature! ⚡'});
    });
    
  }
}