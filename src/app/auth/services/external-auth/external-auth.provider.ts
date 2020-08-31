import { UserInfo } from './../../../../models/userInfo';

export interface ExternalAuthProvider {

  getAccessToken(authCode: string): Promise<string>;

  getUserInfo(authCode: string): Promise<UserInfo>;

}