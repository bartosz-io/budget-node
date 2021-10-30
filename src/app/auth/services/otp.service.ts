import { authenticator } from 'otplib';

import { User } from 'src/models/user';
import { AuthRequest } from 'src/models/authRequest';
import log from './../../../utils/logger';

export class OtpService {

  checkOtpIfRequired(loginRequest: AuthRequest, user: User) {
    return new Promise<void>((resolve, reject) => {
      if (user.tfa) { 
        
        if (!loginRequest.otp) {
          return reject('OTP_REQUIRED');
        }
  
        if (!user.tfaSecret) {
          log.error('auth.otp.secret_missing', { user });
          return reject('System error. Contact support.');
        }

        try {
          // INFO: async authenticator implementation is also available
          const isValid = authenticator.check(loginRequest.otp, user.tfaSecret);
          if (!isValid) {
            log.error('auth.otp.invalid_code', { user });
            return reject('Invalid one-time code');
          }
        } catch (error) {
          log.error('auth.otp.error', { user, error });
          return reject();
        }

        log.info('auth.otp.valid', { user });
      }
      
      resolve();
    });
  }

  getOtpKeyUri(user: User) {
    const service = 'BudgetApp';
    return authenticator.keyuri(user.email!, service, user.tfaSecret!);
  }

  generateNewSecret() {
    const bytes = 20; // 20 * 8 = 160 bits
    return authenticator.generateSecret(bytes); // generated secret is Base32 encoded (so will have different length)
  }
}