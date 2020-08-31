import { GithubAuthProvider } from './github-auth.provider';
import { ExternalAuthProvider } from './external-auth.provider';

export function getExternalAuthProvider(provider: string): ExternalAuthProvider {
  switch (provider) {
    case 'github':
      return new GithubAuthProvider();
    default:
      throw 'Auth provider not defined';
  }
}