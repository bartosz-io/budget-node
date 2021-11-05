import { Request, Response, Router } from 'express';
import { Auth0Service } from './auth0.service';
import stateService from '../auth/services/external-auth/state.service';
import config from '../../config';

const router = Router();
const auth0 = new Auth0Service();

router.get('/', function (req: Request, res: Response) {

  res.redirect(`${config.auth0.authorizeUrl}` +
    `?client_id=${config.auth0.clientID}` +
    `&state=${stateService.setAndGetNewState(req.session)}` +
    `&response_type=code` +
    `&scope=${config.auth0.scope}` +
    `&redirect_uri=${config.auth0.callbackURL}`);

});

router.get('/callback', function (req, res) {
  const authCode = req.query.code as string;
  const state = req.query.state as string;

  stateService.assertStateIsValid(req.session, state)
    .then(() => checkErrors(req))
    .then(() => auth0.login(authCode, req.session))
    .then(() => res.redirect('/'))
    .catch((err) => res.redirect(`/login?msg=${err}`));
});

function checkErrors(req: Request) {
  if (req.query.error) {
    throw new Error(req.query.error_description as string);
  }
}

export default router;