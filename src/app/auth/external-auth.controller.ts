import { Request, Response, Router } from 'express';
import { ExternalAuthService } from './services/external-auth/external-auth.service';
import stateService from './services/external-auth/state.service';
import config from '../../config';

const router = Router();
const externalAuthService = new ExternalAuthService();

router.get('/:provider/:action', function (req: Request, res: Response) {
  const provider = req.params.provider;
  const action = req.params.action === 'signup' ? 'signup' : 'login';

  if (provider in config.externalAuth) {
    const providerConfig = (<any>config.externalAuth)[provider];
    const redirect_uri = `${providerConfig.callbackURL}/${action}`;

    res.redirect(`${providerConfig.authorizeUrl}` +
      `?client_id=${providerConfig.clientID}` +
      `&response_type=code` +
      `&state=${stateService.setAndGetNewState(req.session)}` +
      // `&access_type=offline` + // INFO: this requests Refresh Token
      `&scope=${providerConfig.scope}` +
      `&redirect_uri=${redirect_uri}`);

  } else {
    res.redirect(`/login?msg=Provider not supported`);
  }

});

router.get('/:provider/callback/signup', function (req, res) {
  const provider = req.params.provider;
  const authCode = req.query.code as string;
  const state = req.query.state as string;
  stateService.assertStateIsValid(req.session, state).then(() =>
    externalAuthService.signup(provider, authCode, req.session).then(() => {
      res.redirect('/');
    })
  ).catch((err) => {
    res.redirect(`/login?msg=${err ? err : 'Signup failed'}`);
  });
});

router.get('/:provider/callback/login', function (req, res) {
  const provider = req.params.provider;
  const authCode = req.query.code as string;
  const state = req.query.state as string;
  stateService.assertStateIsValid(req.session, state).then(() =>
    externalAuthService.login(provider, authCode, req.session).then(() => {
      res.redirect('/');
    })
  ).catch((err) => {
    res.redirect(`/login?msg=${err ? err : 'Login failed'}`);
  });
});

export default router;