export type User = {
  socketId: string;
  roomId: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  username?: string;
  nickname?: string;
  image?: string;
  sid?: string;
  joinedAt: Date;
  isConnected: boolean;
};
export type IncomingCall = {
  roomId: string;
  from: string;
  user: User;
  offer: RTCSessionDescriptionInit;
};

export type Message = {
  from: string;
  displayPicture: string;
  message: string;
  isSelf: boolean;
  timestamp: number;
};

export type AvailableFiles = {
  name: string;
  size: number;
  blob?: Blob;
  recievedSize?: number;
  checksum?: string;
  checksumMatched?: boolean;
  timestamp: number;
};
