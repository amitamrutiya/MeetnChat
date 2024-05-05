"use client";

import { Input } from "@/components/ui/input";
import {
  Mail,
  UsersRound,
  MessageCircleMore,
  SettingsIcon,
  PaperclipIcon,
  MicIcon,
  SmileIcon,
  SendHorizonalIcon,
  VideoIcon,
  PhoneCallIcon,
  AudioLines,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function Room() {
  const [selectedTab, setSelectedTab] = useState("Chats");
  const tags = Array.from({ length: 15 }).map(
    (_, i, a) => `v1.2.0-beta.${a.length - i}`
  );
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
    <div className="flex flex-col md:flex-row gap-4 p-4 max-h-screen">
      <section className="flex-grow  bg-[#1f1f1f] rounded-3xl xl:w-1/4 md:w-1/3 md:block">
        <div className="flex flex-col justify-evenly h-[100%]">
          <div>
            <div className="Search p-5 mb-8">
              <div className="grid  w-full max-w-full items-center gap-1.5">
                <Input
                  className="rounded-3xl"
                  type="search"
                  id="search"
                  placeholder="Search"
                />
                {/* TODO: Add Search Icon */}
              </div>
            </div>
            <div className="Menu flex justify-evenly mb-4">
              <Button
                variant="outline"
                className={`p-8 rounded-2xl ${
                  selectedTab === "Chats" ? "bg-primary" : ""
                }`}
                onClick={() => setSelectedTab("Chats")}
              >
                <div className="flex flex-col justify-center items-center">
                  <MessageCircleMore />
                  <p>Chats</p>
                </div>
              </Button>
              <Button
                variant="outline"
                className={`p-8 rounded-2xl ${
                  selectedTab === "Contacts" ? "bg-primary" : ""
                }`}
                onClick={() => setSelectedTab("Contacts")}
              >
                <div className="flex flex-col justify-center items-center">
                  <UsersRound />
                  <p>Contacts</p>
                </div>
              </Button>

              <Button
                variant="outline"
                className={`p-8 rounded-2xl ${
                  selectedTab === "Invite" ? "bg-primary" : ""
                }`}
                onClick={() => setSelectedTab("Invite")}
              >
                <div className="flex flex-col justify-center items-center">
                  <Mail />
                  <p>Invite</p>
                </div>
              </Button>
            </div>
            {selectedTab === "Chats" && (
              <div className="ChatList h-1/2 rounded-md border px-4 mb-8 overflow-auto">
                <div className="p-4">
                  <h4 className="mb-7 text-md font-bold leading-none text-center">
                    Your Recent Chat
                  </h4>
                  {tags.map((tag) => (
                    <>
                      <div key={tag} className="flex justify-between">
                        <div className="left-side flex">
                          <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                          </Avatar>
                          <div className="chat flex-col ml-5">
                            <div className="name">John Doe</div>
                            <div className="message text-gray-400 text-sm">
                              Hello My name is John Doe
                            </div>
                          </div>
                        </div>
                        <div className="right-side text-gray-400 text-xs">
                          03:36
                        </div>
                      </div>
                      <Separator className="my-2" />
                    </>
                  ))}
                </div>
              </div>
            )}
            {selectedTab === "Contacts" && (
              <div className="Contacts">Contacts Content</div>
            )}
            {selectedTab === "Invite" && (
              <div className="Invite">Invite Content</div>
            )}
          </div>
          <div className="Profile mb-10 rounded-full flex justify-between items-center bg-secondary mx-6 gap-3">
            <div className="flex flex-row items-center">
              <Avatar className="h-[70px] w-[70px]">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="chat flex-col ml-5">
                <div className="name">John Doe</div>
                <div className="message text-gray-400 text-sm">Online</div>
              </div>
            </div>
            <div className="pr-6">
              <SettingsIcon />
            </div>
          </div>
        </div>
      </section>
      <main className="px-6 flex-grow bg-[#181818] rounded-3xl xl:w-1/2 md:w-2/3">
        <div className="flex flex-col justify-between items-center h-[100%]">
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
      </main>
      <section className="p-6 flex-grow bg-[#1f1f1f] rounded-3xl xl:w-1/4 md:block hidden">
        <div className="flex flex-col justify-between h-[100%]">
          <div className="flex flex-col mt-6 justify-center items-center">
            <Image
              src="https://github.com/shadcn.png"
              alt="logo"
              width={208}
              height={208}
              className="rounded-3xl"
            />
            <h1 className="text-xl font-bold text-white mt-4">John Doe</h1>
            <p className="text-gray-400 text-sm">Online</p>
            <div className="flex space-x-7">
              <button className="my-6 transition duration-500 ease-in-out bg-green-500 hover:bg-white hover:text-green-500 text-white font-bold py-2 px-4 rounded-full inline-flex items-center">
                <VideoIcon className="h-10 w-10" />
              </button>
              <button className="my-6 transition duration-500 ease-in-out bg-green-500 hover:bg-white hover:text-green-500 text-white font-bold py-2 px-4 rounded-full inline-flex items-center">
                <PhoneCallIcon className="h-10 w-10" />
              </button>
            </div>
            <div className="flex flex-col w-full justify-between space-y-4">
              <div className="flex justify-evenly w-full space-x-2">
                <Label htmlFor="airplane-mode">Notification</Label>
                <Switch id="airplane-mode" />
              </div>
              <ChatProfileTile
                title="Bio"
                subtitle="Love to Chat"
              ></ChatProfileTile>
              <ChatProfileTile
                title="Phone Number"
                subtitle="+91 95465 32658"
              ></ChatProfileTile>
              <ChatProfileTile
                title="User Name"
                subtitle="@johndoe"
              ></ChatProfileTile>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <Button variant="secondary" className="rounded-3xl px-10 my-4">
              Edit Contect
            </Button>
            <Button variant="secondary" className="rounded-3xl px-10">
              Block
            </Button>
            <footer className="flex items-center justify-center text-xl my-6 align-middle font-sans font-bold antialiased">
              <AudioLines className="mr-2 inline" />
              Connect <span className="text-sky-400/100"> Friends</span>
            </footer>
          </div>
        </div>
      </section>
    </div>
  );
}

interface ChatProfileTileProps {
  title: string;
  subtitle: string;
}

const ChatProfileTile: React.FC<ChatProfileTileProps> = ({
  title,
  subtitle,
}) => {
  return (
    <div className="flex flex-col px-7 w-full justify-evenly ">
      <h2 className="text-md font-bold">{title}</h2>
      <p className="text-gray-500 text-sm">{subtitle}</p>
    </div>
  );
};
