export type User = {
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
export type IncomingCall = {
  roomId: string;
  from: string;
  user: User;
  offer: RTCSessionDescriptionInit;
}

export type Message = {
  from: string;
  displayPicture: string;
  message: string;
  isSelf: boolean;
  timestamp: number;
}

export type AvailableFiles = {
  name: string;
  size: number;
  blob?: Blob;
  recievedSize?: number;
  checksum?: string | null;
  checksumMatched?: boolean;
  timestamp: number;
};