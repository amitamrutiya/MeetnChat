import { Chat } from "@prisma/client";

export interface ApiResponse {
  success: boolean;
  message: string;
  isAcceptingMessages?: boolean;
  chats?: Array<Chat>;
}
