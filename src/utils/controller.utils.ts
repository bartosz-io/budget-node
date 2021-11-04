import { Request } from 'express';
import { Period } from '../models/period';

export function buildPeriodFromRequest(req: Request) {
  const month = parseInt(req.query.month as string);
  const year = parseInt(req.query.year as string);
  return new Period(month, year);
}