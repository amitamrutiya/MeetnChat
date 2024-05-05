"use client";

import {
  MicIcon,
  PaperclipIcon, SendHorizonalIcon, SmileIcon
} from "lucide-react";
import { useEffect, useRef } from "react";

function ChatRoomSection() {
  const chatData = [
    {
      message: "Hello, how are you?",
      isSelf: true,
      from: "User1",
      sentTime: "2022-01-01T10:00:00Z",
    },
    {
      message: "I'm good, thanks! How about you?",
      isSelf: false,
      from: "User2",
      sentTime: "2022-01-01T10:01:00Z",
    },
    {
      message: "I'm doing well, thank you.",
      isSelf: true,
      from: "User1",
      sentTime: "2022-01-01T10:02:00Z",
    },
    {
      message: "That's great to hear!",
      isSelf: false,
      from: "User2",
      sentTime: "2022-01-01T10:03:00Z",
    },
    {
      message: "Hello, how are you?",
      isSelf: true,
      from: "User1",
      sentTime: "2022-01-01T10:00:00Z",
    },
    {
      message: "I'm good, thanks! How about you?",
      isSelf: false,
      from: "User2",
      sentTime: "2022-01-01T10:01:00Z",
    },
    {
      message: "I'm doing well, thank you.",
      isSelf: true,
      from: "User1",
      sentTime: "2022-01-01T10:02:00Z",
    },
    {
      message: "That's great to hear!",
      isSelf: false,
      from: "User2",
      sentTime: "2022-01-01T10:03:00Z",
    },
    {
      message: "Hello, how are you?",
      isSelf: true,
      from: "User1",
      sentTime: "2022-01-01T10:00:00Z",
    },
    {
      message: "I'm good, thanks! How about you?",
      isSelf: false,
      from: "User2",
      sentTime: "2022-01-01T10:01:00Z",
    },
    {
      message: "I'm doing well, thank you.",
      isSelf: true,
      from: "User1",
      sentTime: "2022-01-01T10:02:00Z",
    },
    {
      message: "That's great to hear!",
      isSelf: false,
      from: "User2",
      sentTime: "2022-01-01T10:03:00Z",
    },
    {
      message: "Hello, how are you?",
      isSelf: true,
      from: "User1",
      sentTime: "2022-01-01T10:00:00Z",
    },
    {
      message: "I'm good, thanks! How about you?",
      isSelf: false,
      from: "User2",
      sentTime: "2022-01-01T10:01:00Z",
    },
    {
      message: "I'm doing well, thank you.",
      isSelf: true,
      from: "User1",
      sentTime: "2022-01-01T10:02:00Z",
    },
    {
      message: "That's great to hear!",
      isSelf: false,
      from: "User2",
      sentTime: "2022-01-01T10:03:00Z",
    },
  ];

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className="flex flex-col justify-between items-center h-full">
      <div className="h-5/6 w-full my-6 overflow-auto">
        {chatData.map((chat, index) => (
          <div
            key={index}
            className={`flex flex-col ${
              chat.isSelf ? "items-end" : "items-start"
            } mb-4`}
          >
            <div
              className={`max-w-2/3 p-3 rounded-xl ${
                chat.isSelf
                  ? "bg-primary text-white mr-6"
                  : "bg-secondary text-gray-100"
              }`}
            >
              <p className="text-sm ">{chat.message}</p>
              <p
                className="text-xs text-right mt-2 text-gray-50"
                suppressHydrationWarning
              >
                {new Date(chat.sentTime).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <div className="flex items-center w-full m-6 h-16 space-x-3 bg-secondary shadow-sm rounded-full p-3">
        <input
          className="flex-grow outline-none"
          type="text"
          placeholder="Type a message"
        />
        <button type="submit">
          <SendHorizonalIcon className="h-6 w-6 text-gray-500 cursor-pointer" />
        </button>
        <SmileIcon className="h-6 w-6 text-gray-500 cursor-pointer" />
        <PaperclipIcon className="h-6 w-6 text-gray-500 cursor-pointer" />
        <MicIcon className="h-6 w-6 text-gray-500 cursor-pointer" />
      </div>{" "}
    </div>
  );
}

export default ChatRoomSection;
