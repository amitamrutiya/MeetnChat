"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckIcon,
  Mail,
  MessageCircleMore,
  SettingsIcon,
  UsersRound,
  XIcon,
} from "lucide-react";
import React, { useState } from "react";

function ChatRoomSearchSection() {
  const [selectedTab, setSelectedTab] = useState("Chats");
  const tags = Array.from({ length: 15 }).map(
    (_, i, a) => `v1.2.0-beta.${a.length - i}`
  );
  return (
    <div className="flex flex-col justify-between  h-full">
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
            className={`p-5 xl:p-8 rounded-2xl ${
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
            className={`p-5 xl:p-8 rounded-2xl ${
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
            className={`p-5 xl:p-8 rounded-2xl ${
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
      </div>
      {selectedTab === "Chats" && (
        <div className="ChatList mb-10 rounded-md border px-4 overflow-auto">
          <div className="p-4">
            <h4 className="text-md font-bold leading-none text-center my-3">
              Your Recent Chat
            </h4>
            {tags.map((tag) => (
              <>
                <React.Fragment key={tag}>
                  <div className="flex justify-between">
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
                </React.Fragment>
                <Separator className="my-2" />
              </>
            ))}
          </div>
        </div>
      )}
      {selectedTab === "Contacts" && (
        <div className="Contacts mb-10 rounded-md border px-4 overflow-auto">
          <div className="p-4">
            <h4 className="text-md font-bold leading-none text-center my-3">
              All Contacts
            </h4>
            {tags.map((tag) => (
              <>
                <React.Fragment key={tag}>
                  <div className="flex justify-between">
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
                  </div>
                </React.Fragment>
                <Separator className="my-2" />
              </>
            ))}
          </div>
        </div>
      )}
      {selectedTab === "Invite" && (
        <Tabs defaultValue="invite" className="mx-3  w-[95%] h-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="invite">Invite</TabsTrigger>
            <TabsTrigger value="request">Request</TabsTrigger>
          </TabsList>
          <TabsContent value="request">
            <div className="h-[30rem] my-10 rounded-md border px-2 overflow-auto">
              {tags.map((tag) => (
                <React.Fragment key={tag}>
                  <div className="flex justify-between">
                    <div className="flex">
                      <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <div className="chat flex-col ml-2">
                        <div className="name">John Doe</div>
                        <div className="message text-gray-400 text-xs">
                          Hello My name is John Doe
                        </div>
                      </div>
                    </div>
                    <div className="">
                      <Button variant="secondary">
                        <CheckIcon />
                      </Button>
                      <Button variant="destructive">
                        <XIcon />
                      </Button>
                    </div>
                  </div>
                  <Separator className="my-2" />
                </React.Fragment>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="invite">
            <div className="h-[30rem] my-10 rounded-md border px-4 overflow-auto">
              {tags.map((tag) => (
                <React.Fragment key={tag}>
                  <div className="flex justify-between">
                    <div className="flex">
                      <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <div className="chat flex-col ml-5">
                        <div className="name">John Doe</div>
                        <div className="message text-gray-400 text-xs">
                          Hello My name is John Doe
                        </div>
                      </div>
                    </div>
                    <Button>Invite</Button>
                  </div>
                  <Separator className="my-2" />
                </React.Fragment>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}

      <div className="profile mb-6 rounded-full flex justify-between items-center bg-secondary mx-6 gap-3">
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
  );
}

export default ChatRoomSearchSection;
