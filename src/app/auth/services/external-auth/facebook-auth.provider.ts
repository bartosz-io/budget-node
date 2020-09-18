const axios = require('axios');
import config from '../../../../config';
import { UserInfo } from '../../../../models/userInfo';
import { ExternalAuthProvider } from './external-auth.provider';
import log from '../../../../utils/logger';

export class FacebookAuthProvider implements ExternalAuthProvider {

  getAccessToken(authCode: string, action?: string): Promise<string> {
    const options = { headers: { accept: 'application/json' } };
    const body = {
      client_id: config.externalAuth.facebook.clientID,
      client_secret: config.externalAuth.facebook.clientSecret,
      redirect_uri: config.externalAuth.facebook.callbackURL+`/${action}`,
      code: authCode
    };
    return axios.post(config.externalAuth.facebook.accessTokenUrl, body, options)
      .then((res: any) => res.data['access_token'])
      .catch((error: any) => {
        log.error('auth.facebook.getAccessToken_failed', { error });
        throw error;
      })
  }

  getUserInfo(accessToken: string): Promise<UserInfo> {
    const queryParams = `?access_token=${accessToken}&fields=id,email`;
    return axios.get(config.externalAuth.facebook.userInfoUrl + queryParams)
      .then((res: any) => {
        log.info('auth.facebook.getUserInfo', { facebookId: res.data.id });
        return {
          id: res.data.id.toString(),
          email: res.data.email
        } as UserInfo;
      }).catch((error: any) => {
        log.error('auth.facebook.getUserInfo_failed', { error });
        return Promise.reject('Could not get UserInfo from Facebook')
      });
  }

}