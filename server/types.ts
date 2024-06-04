export interface User {
  socketId: string;
  roomId: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  nickname?: string;
  picture?: string;
  sid?: string;
  joinedAt: Date;
  isConnected: boolean;
}

export interface RoomUser {
  id: string;
  fullname: string;
  email: string;
}
