import { Chat, User } from "@prisma/client";

export type AvailableFiles = {
  name: string;
  size: number;
  blob?: Blob;
  recievedSize?: number;
  checksum?: string;
  checksumMatched?: boolean;
  timestamp: number;
};

export interface ApiResponse {
  success: boolean;
  message: string;
  isAcceptingMessages?: boolean;
  chats?: Array<Chat>;
}

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

export type RoomUser = {
  id: string;
  fullname: string;
  email: string;
};
