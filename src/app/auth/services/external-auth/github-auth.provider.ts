const axios = require('axios');
import config from '../../../../config';
import { UserInfo } from '../../../../models/userInfo';
import { ExternalAuthProvider } from './external-auth.provider';
import log from '../../../../utils/logger';

export class GithubAuthProvider implements ExternalAuthProvider {

  getAccessToken(authCode: string): Promise<string> {
    const options = { headers: { accept: 'application/json' } };
    const body = {
      client_id: config.externalAuth.github.clientID,
      client_secret: config.externalAuth.github.clientSecret,
      code: authCode
    };
    return axios.post(config.externalAuth.github.accessTokenUrl, body, options)
      .then((res: any) => res.data['access_token'])
      .catch((error: any) => {
        log.error('auth.github.getAccessToken_failed', { error });
        throw error;
      })
  }

  getUserInfo(accessToken: string): Promise<UserInfo> {
    const options = { headers: { Authorization: `token ${accessToken}` } };
    return axios.get(config.externalAuth.github.userInfoUrl, options)
      .then((res: any) => {
        log.info('auth.github.getUserInfo', { githubId: res.data.id });
        return {
          id: res.data.id.toString(),
          login: res.data.login,
          email: res.data.email
        } as UserInfo;
      }).catch((error: any) => {
        log.error('auth.github.getUserInfo_failed', { error });
        return Promise.reject('Could not get UserInfo from GitHub')
      });
  }

}