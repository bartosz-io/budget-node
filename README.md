# Budget application

This is the final project in the training program [Web Security Academy](https://websecurity-academy.com/?utm_source=github&utm_medium=referral&utm_campaign=budget-node-readme). It represents a real-life use case of personal money tracker. There are five main feature modules: *Auth*, *Dashboard*, *Expenses*, *Settings* and *Admin* with many security measures implemented described below. The project implements [role-based access control](https://en.wikipedia.org/wiki/Role-based_access_control) (RBAC), giving different users different permissions. This is the backend part to the accompanying [frontend](https://github.com/bartosz-io/budget-angular) in Angular.

## Main modules

| Auth | Dashboard | Expenses | Settings | Admin |
| ------ |  ------ | ------ | ----- | ----- |
| Login, signup and recover password | Read budgets and account summary | List and manage the expenses belonging to the account | Manage account users and expense categories for account | Manage active sessions of logged users |

## Roles in the system

| Role | Permission |
| ------ | ------ |
| Reader | Read expenses and categories for the account. |
| Owner | Create, read, update and delete expenses, categories. Create and delete account's users.  |
| Admin | Read and delete active users' sessions. |

## Mock users
You can find mock users in [in-memory-user.repository.ts](https://github.com/bartosz-io/budget-node/blob/master/src/app/auth/repositories/in-memory/in-memory-user.repository.ts#L62).

## Authentication mechanisms

There are two authentication mechanism implemented in both Angular and Node.js parts:

- Session cookies
- JWT Tokens

In Node part you can select one mechanism with config setting in `src/config/index.ts` as presented below.
Remember that both Angular and Node.js selections must match!

```ts
auth: 'session' as 'session' | 'jwt'
```

## Implemented security measures

### Access level logging

Every HTTP request is logged with [Morgan logger](https://github.com/expressjs/morgan) and you can configure it with config options in `src/config/index.ts` as below. The presented example is using npm package `rotating-file-stream` to save logs to `access.log` with 1 day rotation.

```ts
  morganPattern: 'common',
  morganStream: rfs.createStream('access.log', {
    interval: '1d',
    path: path.join(process.cwd(), 'log')
  }),
```

The logs with `common` morgan pattern look like below. `::1` represents `localhost` address. You can use different configurations prefined in morgan logger (check the docs).

```log
::1 - - [30/Jul/2020:16:58:58 +0000] "GET /login HTTP/1.1" 404 144
::1 - - [30/Jul/2020:16:59:02 +0000] "GET /auth/user HTTP/1.1" 200 66
::1 - - [30/Jul/2020:16:59:03 +0000] "GET /api/budgets/3/2020 HTTP/1.1" 304 -
::1 - - [30/Jul/2020:16:59:03 +0000] "GET /api/budget-summary/3/2020 HTTP/1.1" 404 34
::1 - - [30/Jul/2020:16:59:04 +0000] "GET /auth/logout HTTP/1.1" 204 -
```

### Application events logging

Every meaningful event in application is logged with [Bunyan](https://github.com/trentm/node-bunyan) logger. This allows to trace back what happened in the system from the application logic perspective. For example user signup is logged in `signup.service.ts` as below. Note the `log.info` invocations with a string containing module name as the first segment of the log message (`auth.*` in this case). This helps to analyze logs later on. For example `log.info('auth.confirmation_successful', { email });` is called upon successful user confirmation after signup.

```ts
export class SignupService {

  signup(signupRequest: AuthRequest): Promise<void> {
    const confirmationCode = randtoken.uid(256);
    return bcrypt.hash(signupRequest.password, 10) // 10 is the salt length (implicit salt generation)
      .then(hashedPassword => accountRepository.createAccount({})
        .then(accountId => Promise.all([
          categoriesRepository.createDefaultCategories(accountId),
          userRepository.createUser({
            accountId: accountId, email: signupRequest.email,
            password: hashedPassword, role: 'OWNER',
            confirmed: false, confirmationCode
          })
        ])).then(() => {
          log.info('auth.signup_successful', { email: signupRequest.email });
          this.sendConfirmationEmail(signupRequest.email, confirmationCode);
          return Promise.resolve();
        }).catch(error => {
          log.error('auth.signup_failed', { email: signupRequest.email });
          throw error; // rethrow the error for the controller
        })
      );
  }

  confirm(email: string, confirmationCode: string): Promise<void> {
    return userRepository.getUserByEmail(email).then(user => {
      if (user && !user.confirmed && user.confirmationCode === confirmationCode) {
        user.confirmed = true;
        user.confirmationCode = undefined;
        log.info('auth.confirmation_successful', { email });
      } else {
        log.warn('auth.confirmation_failed', { email });
        return Promise.reject();
      }
    });
  }

  private sendConfirmationEmail(email: string, code: string) {
    const link = `${CONFIG.clientUrl}/confirm?email=${email}&code=${code}`;
    console.log(`>>> LINK >>>: ${link}`); // mock email sending 😎
    log.info('auth.signup_confirmation_email_sent', { email });
  }
}
```

### Throttling failed logins

In order to prevent brute-force, dictionary attacks or credential suffing application prevents prevents subsequent logins after several failed logins in a defined timeframe. For example you can define login throttling to allow maximum 3 login failures in 10 minutes time window in config as below. Then user needs to wait until the system allows to login with the given username. This feature is implemented in `src/app/auth/services/login.throttler.ts`.

```ts
loginThrottle: {
    maxFailures: 3,
    timeWindowInMinutes: 10
}
```

### Input sanitization and validation

Every input that comes from the frontend is sanitizend and validated with [validator.js](https://github.com/validatorjs/validator.js). Here are some examples from `expenses.validator.ts` used in    `expenses.controller.ts`.

```ts
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
```

### Preventing calls without the proper role

The system prevents "fooling" the frontend that the user poses the given role (for example faking `OWNER` role, but in reality this may be just a `READER` role). This kind of misuse of the system must be protected on the backend side. There are some middlewares implemented to check the proper role for a given operation. For example on the router level system checks the role with `router.use('/users', hasRole('OWNER'));`. Below you can find an example function from `role.middleware.ts`. Note, that the in case of system misuse the event is logged with the application logger.

```ts
export function hasRole(roleToCheck: UserRole) {

  return function (req: Request, res: Response, next: NextFunction) {
    const user = req.user as User;

    if (!isRoleFound(user)) {
      handleRoleNotFound(user, res);
    } else if (user.role !== roleToCheck) {
      log.warn('auth.role_check_failure', { roleToCheck, user });
      res.status(403).json({ msg: 'You are not authorized to perform this operation' });
      next('Unauthorized');
    } else {
      next();
    }
  }
}

```

### License

GPL-3.0
