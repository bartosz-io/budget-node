const axios = require('axios');
import config from '../../../../config';
import { UserInfo } from '../../../../models/userInfo';
import { ExternalAuthProvider } from './external-auth.provider';
import log from '../../../../utils/logger';

export class GoogleAuthProvider implements ExternalAuthProvider {

  getAccessToken(authCode: string, action?: string): Promise<string> {
    const options = { headers: { accept: 'application/json' } };
    const body = {
      client_id: config.externalAuth.google.clientID,
      client_secret: config.externalAuth.google.clientSecret,
      redirect_uri: config.externalAuth.google.callbackURL+`/${action}`,
      grant_type: 'authorization_code',
      code: authCode
    };
    return axios.post(config.externalAuth.google.accessTokenUrl, body, options)
      .then((res: any) => res.data['access_token']) // INFO: also `refresh_token` and `expires_in` in res.data
      .catch((error: any) => {
        log.error('auth.google.getAccessToken_failed', { error });
        throw error;
      })
  }

  getUserInfo(accessToken: string): Promise<UserInfo> {
    const options = { headers: { Authorization: `Bearer ${accessToken}` } };
    return axios.get(config.externalAuth.google.userInfoUrl, options)
      .then((res: any) => {
        log.info('auth.google.getUserInfo', { googleId: res.data.sub });
        return {
          id: res.data.sub,
          email: res.data.email
        } as UserInfo;
      }).catch((error: any) => {
        log.error('auth.google.getUserInfo_failed', { error });
        return Promise.reject('Could not get UserInfo from Google')
      });
  }

}