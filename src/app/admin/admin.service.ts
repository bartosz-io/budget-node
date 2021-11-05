import config from './../../config';
import { SessionData, Store } from 'express-session';

export class AdminService {

  private store: Store = config.sessionConfig.store as Store;

  getActiveSessions(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.store.all?((err: any, sessions: SessionData[]) => {
        if (err) {
          return reject(err);
        }

        if (sessions) {
          const result = Object.entries(sessions).map(([sessionId, session]: [string, SessionData]) => {
            return {
              sessionId,
              user: {
                email: session.user?.email,
                role: session.user?.role
              }
            }
          });
          resolve(result);
        }
      }) : [];
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