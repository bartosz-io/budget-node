import { Request } from 'express';
import { Period } from '../models/period';

export function buildPeriodFromRequest(req: Request) {
    const month = parseInt(req.params.month);
    const year = parseInt(req.params.year);
    return new Period(month, year);
  }