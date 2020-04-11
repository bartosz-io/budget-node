import { Request, Response, NextFunction } from 'express';
import { check, validationResult, ValidationError } from 'express-validator';
import log from './../../utils/logger';

function value() {
  return check('value').isNumeric()
  .withMessage('must be a number');
}

function datetime() {
  return check('datetime').escape();
}

function counterparty() {
  return check('counterparty').escape();
}

function errorParser() {
  return function (req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      log.warn('expenses.validation_failed', {errors: errors.array()});
      res.status(422).json({ msg: formatErrors(errors.array()) });
    } else {
      next();
    }
  }
}

function formatErrors(errors: ValidationError[]) {
  return errors.map(e => `${e.param} ${e.msg}`).join(', ');
}

export default [value(), datetime(), counterparty(), errorParser()];