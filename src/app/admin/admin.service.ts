import config from './../../config';
import { Store } from 'express-session';

export class AdminService {

  private store: Store = config.sessionConfig.store as Store;

  getActiveSessions(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.store.all((err, sessions) => {
        if (err) {
          return reject(err);
        }

        if (sessions) {
          const result = Object.entries(sessions).map(([sessionId, session]: [string, Express.SessionData]) => {
            return {
              sessionId,
              user: {
                email: session.user.email,
                role: session.user.role
              }
            }
          });
          resolve(result);
        }
      });
    });
  }

  destroySession(sessionId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.store.destroy(sessionId, (error) => {
        error ? reject(error) : resolve()
      });
    });
  }

}