import { LoginFailure } from 'src/models/login.failure';

export interface LoginFailureRepository {
  
  // most DB engines provide sorting and limiting number of results
  // we need results sorted by time (newest first) and limited by given number
  getLastFailures(userEmail: string, number: number): Promise<LoginFailure[]>;

  registerFailedLogin(userEmail: string, datetime: Date): Promise<void>;
  
}