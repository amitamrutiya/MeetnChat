import { Chat } from "@/model/chat.model";

export interface ApiResponse {
  success: boolean;
  message: string;
  isAcceptingMessages?: boolean;
  chats?: Array<Chat>;
}
