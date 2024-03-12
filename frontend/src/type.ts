export interface User {
  socketId: string;
  roomId: string;
  email?: string | null;
  email_verified?: boolean | null;
  name?: string | null;
  nickname?: string | null;
  picture?: string | null;
  sid?: string | null;
  joinedAt: Date;
  isConnected: boolean;
}
export interface IncomingCall {
  from: string;
  user: User;
  offer: RTCSessionDescriptionInit;
}
