"use client";

import { selectChatAtom } from "@repo/store";
import { SendHorizonalIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import { useWebSocket } from "./web-socket-context";
import { Avatar, AvatarFallback, AvatarImage, EmojiPicker, Input } from "@repo/ui";
import { Chat } from "@prisma/client";
import { useSession } from "next-auth/react";
import { saveChat } from "app/actions/chat/save-chat";
import Image from "next/image";
import ChatOperationDropDown from "./chat-operation-dropdown";

function ChatRoomSection() {
  const selectedChat = useRecoilValue(selectChatAtom);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const { loadChats, oldChatMessage, sendMessage } = useWebSocket();
  const currentUser = useSession().data?.user;
  useEffect(() => {
    loadChats(selectedChat?.id ?? "");
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedChat]);
  const [message, setMessage] = useState("");

  const handleChange = (event: any) => {
    setMessage(event.target.value);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    if (!message) return;
    const response = await saveChat({ message, sender_id: currentUser?.id!, receiver_id: selectedChat?.id! });
    if (response.success) {
      const chat = response.data as Chat;
      sendMessage(chat);
      setMessage("");
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return selectedChat ? (
    <div className="flex h-full flex-col items-center justify-between">
      {
        <nav className="bg-secondary flex h-16 w-full items-center rounded-xl p-3 shadow-sm">
          <div className="flex min-w-full items-center justify-between space-x-3">
            <div>
              <Avatar>
                <AvatarImage src={selectedChat?.image ?? "https://github.com/shadcn.png"} />
                <AvatarFallback>{selectedChat?.username}</AvatarFallback>
              </Avatar>
            </div>
            <div>
              <p className="font-sans text-lg text-gray-50">{selectedChat?.name}</p>
              <p className="font-sans text-sm text-gray-300">{selectedChat?.email}</p>
            </div>
            <p className="text-sm text-gray-300">{selectedChat?.is_online ? "Online" : "Offline"}</p>
          </div>
        </nav>
      }
      <div className="my-6 h-5/6 w-full overflow-auto">
        {oldChatMessage.map((chat, index) => {
          const isSelf = chat.sender_id !== selectedChat?.id;

          return (
            <div key={index} className={`flex flex-col ${isSelf ? "items-end" : "items-start"} mb-4`}>
              <div
                className={`max-w-2/3 rounded-xl p-3 ${
                  isSelf ? "bg-primary mr-3 text-white" : "bg-secondary text-gray-100"
                }`}
              >
                <div className="flex items-center justify-center gap-3">
                  <Avatar>
                    <AvatarImage
                      src={isSelf ? currentUser?.image! : selectedChat?.image! ?? "https://github.com/shadcn.png"}
                    />
                    <AvatarFallback>{isSelf ? currentUser?.image : selectedChat?.image}</AvatarFallback>
                  </Avatar>
                  <p className="text-sm">{chat.message}</p>
                  {isSelf && <ChatOperationDropDown chat={chat} />}
                </div>
              </div>
              <p className="mr-3 mt-2 text-right text-xs text-gray-50" suppressHydrationWarning>
                {new Date(chat.updatedAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>
      <div className="bg-secondary m-6 flex h-16 w-full items-center space-x-3 rounded-full p-3 shadow-sm">
        <form onSubmit={handleSubmit} className="flex flex-grow outline-none">
          <Input
            autoComplete="off"
            className="min-w-80"
            placeholder="Type a message"
            value={message}
            onChange={handleChange}
            maxLength={300}
          />
          <button type="submit">
            <SendHorizonalIcon className="h-6 w-6 cursor-pointer text-gray-500" />
          </button>
        </form>
        <EmojiPicker
          onChange={(value) => {
            setMessage(message + value);
          }}
        />
      </div>
    </div>
  ) : (
    <div className="flex min-h-full w-full flex-col items-center justify-center rounded-xl p-3 shadow-sm">
      <p className="font-sans text-lg text-gray-50">Select a chat to start conversation</p>
      <Image className="rounded-[8px]" height={350} width={350} src={"/chat.png"} alt="Find Chats" />
    </div>
  );
}

export default ChatRoomSection;
