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
  roomId: string;
  from: string;
  user: User;
  offer: RTCSessionDescriptionInit;
}
