import { Request } from 'express';
import { Period } from '../models/period';

export function buildPeriodFromRequest(req: Request) {
  const month = parseInt(req.query.month);
  const year = parseInt(req.query.year);
  return new Period(month, year);
}