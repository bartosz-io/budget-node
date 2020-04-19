import { Id } from './types';

export class Category {
  constructor(
    public id?: Id,
    public accountId?: Id,
    public name = '',
    public counterpartyPatterns: string[] = []) { }
}
