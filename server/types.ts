export interface User {
  socketId: string;
  roomId: string;
  email?: string;
  is_verified?: boolean;
  name?: string;
  username?: string;
  image?: string;
  sid?: string;
  joinedAt: Date;
  isConnected: boolean;
}

export interface RoomUser {
  id: string;
  fullname: string;
  email: string;
}
