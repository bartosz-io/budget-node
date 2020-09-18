import { GithubAuthProvider } from './github-auth.provider';
import { GoogleAuthProvider } from './google-auth.provider';
import { FacebookAuthProvider } from './facebook-auth.provider';
import { ExternalAuthProvider } from './external-auth.provider';

export function getExternalAuthProvider(provider: string): ExternalAuthProvider {
  switch (provider) {
    case 'github':
      return new GithubAuthProvider();
    case 'google':
      return new GoogleAuthProvider();
    case 'facebook':
      return new FacebookAuthProvider();
    default:
      throw 'Auth provider not defined';
  }
}