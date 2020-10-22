const axios = require('axios');

import { Id } from '../../models/types';
import log from '../../utils/logger';
import config from '../../config';

export class Auth0Api {

  getIdToken(authCode: string): Promise<string> {
    const options = { headers: { accept: 'application/json' } };
    const body = {
      client_id: config.auth0.clientID,
      client_secret: config.auth0.clientSecret,
      redirect_uri: config.auth0.callbackURL,
      grant_type: 'authorization_code',
      code: authCode
    };

    return axios.post(config.auth0.accessTokenUrl, body, options)
      .then((res: any) => res.data['id_token'])
      .catch((error: any) => {
        log.error('auth0.getIdToken_failed', { error });
        throw error;
      })
  }

  getAccessToken(): Promise<string> {
    const options = { headers: { accept: 'application/json' } };
    const body = {
      client_id: config.auth0.clientID,
      client_secret: config.auth0.clientSecret,
      audience: config.auth0.apiUrl,
      grant_type: 'client_credentials'
    };

    return axios.post(config.auth0.accessTokenUrl, body, options)
      .then((res: any) => res.data['access_token'])
      .catch((error: any) => {
        log.error('auth0.getAccessToken_failed', { error });
        throw error;
      });
  }

  updateUser(accessToken: string, userId: Id, data: any) {
    const options = { headers: { Authorization: `Bearer ${accessToken}` } };
    return axios.patch(`${config.auth0.apiUrl}users/${userId}`, data, options)
      .then((res: any) => {
        log.info('auth0.user.updated', { userId, data });
        return res.data;
      }).catch((error: any) => {
        log.error('auth0.user.update_failed', { error });
        return Promise.reject('Could not signup user');
      });
  }

}