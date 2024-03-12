interface User {
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

interface RoomUser {
  id: string;
  fullname: string;
  email: string;
}