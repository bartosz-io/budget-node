import { Request, Response, NextFunction } from 'express';
import { check, validationResult, ValidationError } from 'express-validator';
import log from './../../utils/logger';

function passwordValidator() {
  return check('password').isLength({ min: 5 })
    .withMessage('must have at least 5 characters');
}

function emailValidator() {
  return check('email').isEmail()
    .withMessage('is not valid');
}

function errorParser() {
  return function (req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      log.warn('auth.signup_validation_failed', {errors: errors.array()});
      res.status(422).json({ msg: formatErrors(errors.array()) });
    } else {
      next();
    }
  }
}

function formatErrors(errors: ValidationError[]) {
  return errors.map(e => `${e.param} ${e.msg}`).join(', ');
}

export default [passwordValidator(), emailValidator(), errorParser()];