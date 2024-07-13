"use client";

import { selectChatAtom } from "@repo/store";
import { MicIcon, PaperclipIcon, SendHorizonalIcon, SmileIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import { useWebSocket } from "./web-socket-context";
import { Avatar, AvatarFallback, AvatarImage, Textarea, EmojiPicker } from "@repo/ui";
import { Chat } from "@prisma/client";
import { useSession } from "next-auth/react";
import { saveChat } from "app/actions/chat/save-chat";

function ChatRoomSection() {
  const selectedChat = useRecoilValue(selectChatAtom);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const { loadChats, oldChatMessage, sendMessage } = useWebSocket();
  const currentUser = useSession().data?.user;
  useEffect(() => {
    console.log(selectedChat);
    loadChats(selectedChat?.id ?? "");
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedChat]);
  const [message, setMessage] = useState("");

  const handleChange = (event: any) => {
    setMessage(event.target.value);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const response = await saveChat({ message, sender_id: currentUser?.id!, receiver_id: selectedChat?.id! });
    if (response.success) {
      const chat = response.data as Chat;
      sendMessage(chat);
      setMessage("");
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col justify-between items-center h-full">
      {selectedChat ? (
        <nav className="flex items-center w-full h-16 bg-secondary shadow-sm p-3 rounded-xl">
          <div className="flex items-center space-x-3 min-w-full justify-between">
            <div>
              <Avatar>
                <AvatarImage src={selectedChat?.image ?? "https://github.com/shadcn.png"} />
                <AvatarFallback>{selectedChat?.username}</AvatarFallback>
              </Avatar>{" "}
            </div>
            <div>
              <p className="text-lg text-gray-50 font-sans">{selectedChat?.name}</p>
              <p className="text-sm text-gray-300 font-sans">{selectedChat?.email}</p>
            </div>
            <p className="text-sm text-gray-300">{selectedChat?.is_online ? "Online" : "Offline"}</p>
          </div>
        </nav>
      ) : (
        <div className="flex items-center justify-center w-full h-16 bg-secondary shadow-sm p-3 rounded-xl">
          <p className="text-lg text-gray-50 font-sans">Select a chat to start conversation</p>
        </div>
      )}
      <div className="h-5/6 w-full my-6 overflow-auto">
        {oldChatMessage.map((chat, index) => {
          const isSelf = chat.sender_id !== selectedChat?.id;

          return (
            <div key={index} className={`flex flex-col ${isSelf ? "items-end" : "items-start"} mb-4`}>
              <div
                className={`max-w-2/3 p-3 rounded-xl ${
                  isSelf ? "bg-primary text-white mr-3" : "bg-secondary text-gray-100"
                }`}
              >
                <p className="text-sm ">{chat.message}</p>
                <p className="text-xs text-right mt-2 text-gray-50" suppressHydrationWarning>
                  {new Date(chat.updatedAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>
      <div className="flex items-center w-full m-6 h-16 space-x-3 bg-secondary shadow-sm rounded-full p-3">
        <form onSubmit={handleSubmit} className="flex flex-grow outline-none py-2 ">
          <Textarea
            autoComplete="off"
            className="min-w-80"
            placeholder="Type a message"
            value={message}
            onChange={handleChange}
          />
          <button type="submit">
            <SendHorizonalIcon className="h-6 w-6 text-gray-500 cursor-pointer" />
          </button>
        </form>
        <EmojiPicker
          onChange={(value) => {
            setMessage(message + value);
          }}
        />
        <PaperclipIcon className="h-6 w-6 text-gray-500 cursor-pointer" />
        <MicIcon className="h-6 w-6 text-gray-500 cursor-pointer" />
      </div>
    </div>
  );
}

export default ChatRoomSection;
