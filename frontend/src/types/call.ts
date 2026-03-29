import type { User } from './user';

export type CallStatus = 'idle' | 'ringing' | 'calling' | 'in-call';

export interface IncomingCall {
  caller?: User;
  channel?: string;
}
