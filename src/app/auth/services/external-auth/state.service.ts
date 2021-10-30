const randtoken = require('rand-token');
import log from '../../../../utils/logger';

const LENGTH = 32;

export default {

  setAndGetNewState(session: any) {
    session.oauthState = randtoken.generate(LENGTH);
    return session.oauthState;
  },

  getAndRemoveState(session: any) {
    const state = session.oauthState;
    session.oauthState = null;
    return state;
  },

  assertStateIsValid(session: any, state: string) {
    return new Promise<void>((resolve, reject) => {
      if (!!state && state.length === LENGTH && state === session.oauthState) {
        log.info('auth.external.state.valid_check', { state });
        resolve();
      } else {
        log.error('auth.external.state.failed_check', { state: state, expectedState: session.oauthState });
        reject('Invalid state paramater');
      }
    });
  }

}