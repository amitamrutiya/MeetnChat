"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@repo/ui/utils";
import ChatBottombar from "./chat-bottombar";
import { GroupChat, Group, Chat, User } from "@prisma/client";
import ChatOperationDropDown from "./chat-operation-dropdown";
import { Avatar, AvatarImage } from "@repo/ui";

type Message = GroupChat | Chat;

interface ChatListProps {
  messages?: Message[];
  selectedUser: Group | User;
  currentUserId: string;
  sendMessage: (newMessage: string) => void;
  currentUserImage?: string;
  currentUserName?: string;
  editChatMessage?: (chat_id: string, message: string) => void;
  editGroupChatMessage?: (chat_id: string, message: string) => void;
  deleteChatMessage?: (chat_id: string) => void;
  deleteGroupChatMessage?: (chat_id: string) => void;
}

function isGroupChat(chat: Chat | GroupChat): chat is GroupChat {
  return (chat as GroupChat).group_id !== undefined;
}

export function ChatList({
  messages,
  selectedUser,
  sendMessage,
  currentUserId,
  currentUserImage,
  currentUserName,
  editChatMessage,
  editGroupChatMessage,
  deleteChatMessage,
  deleteGroupChatMessage,
}: ChatListProps) {
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto overflow-x-hidden">
      <div ref={messagesContainerRef} className="flex h-full w-full flex-col overflow-y-auto overflow-x-hidden">
        <AnimatePresence>
          {messages?.map((message, index) => {
            const isSelf = message.sender_id === currentUserId;
            const isGroup = isGroupChat(message);
            return (
              <motion.div
                key={index}
                layout
                initial={{ opacity: 0, scale: 1, y: 50, x: 0 }}
                animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                exit={{ opacity: 0, scale: 1, y: 1, x: 0 }}
                transition={{
                  opacity: { duration: 0.1 },
                  layout: {
                    type: "spring",
                    bounce: 0.3,
                    duration: messages.indexOf(message) * 0.05 + 0.2,
                  },
                }}
                style={{
                  originX: 0.5,
                  originY: 0.5,
                }}
                className={cn("flex flex-col gap-2 whitespace-pre-wrap p-4", isSelf ? "items-end" : "items-start")}
              >
                <div className={cn("bg-accent flex items-center gap-2 rounded-xl px-3", isSelf ? "bg-primary" : "")}>
                  {!isSelf && (
                    <Avatar className="flex items-center justify-center">
                      <AvatarImage
                        src={isGroup ? message.sender_image : selectedUser.image ?? ""}
                        alt={isGroup ? message.sender_name : selectedUser.name ?? ""}
                        width={6}
                        height={6}
                      />
                    </Avatar>
                  )}
                  <div className={cn("flex flex-col", !isGroup && "my-2")}>
                    <div className="flex max-w-xs flex-col items-center rounded-md p-2">
                      {!isSelf && isGroup && (
                        <span className={`text-primary text-xs ${isSelf ? "self-end" : "self-start"}`}>
                          {message.sender_name.split(" ")[0]}
                        </span>
                      )}
                      <p className="text-base">{message.message}</p>
                    </div>
                  </div>
                  {isSelf && (
                    <Avatar className="my-2 flex items-center justify-center">
                      <AvatarImage
                        src={isGroup ? message.sender_image : currentUserImage ?? ""}
                        alt={isGroup ? message.sender_name : currentUserName ?? ""}
                        width={6}
                        height={6}
                      />
                    </Avatar>
                  )}
                  {isSelf && (
                    <ChatOperationDropDown
                      chat={message.message}
                      chat_id={message.id}
                      isGroupChat={isGroup}
                      deleteChatMessage={deleteChatMessage}
                      deleteGroupChatMessage={deleteGroupChatMessage}
                      editChatMessage={editChatMessage}
                      editGroupChatMessage={editGroupChatMessage}
                    />
                  )}
                </div>
                <p className="mr-3 text-right text-xs text-gray-50" suppressHydrationWarning>
                  {new Date(message.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      <ChatBottombar sendMessage={sendMessage} />
    </div>
  );
}
