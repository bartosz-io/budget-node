import { UserInfo } from './../../../../models/userInfo';

export interface ExternalAuthProvider {

  getAccessToken(authCode: string, action?: string): Promise<string>;

  getUserInfo(accessToken: string): Promise<UserInfo>;

}