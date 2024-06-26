"use client";

import { selectChatAtom } from "@repo/store";
import { Avatar, AvatarImage, AvatarFallback, Separator } from "@repo/ui";
import { chat } from "hooks/use-chat";
import React from "react";
import { useRecoilState } from "recoil";

const ChatSearchContactsTab = () => {
  const { contacts } = useChat();
  const [selectChat, setSelectChat] = useRecoilState(selectChatAtom);

  return (
    <div className="Contacts mb-10 h-full overflow-auto rounded-md border">
      <div className="p-4">
        <h4 className="text-md my-3 text-center font-bold leading-none">All Contacts</h4>
        {contacts.map((user) => (
          <React.Fragment key={user.id}>
            <div
              className={`flex cursor-pointer justify-between rounded-lg p-3 ${selectChat?.id === user.id ? "bg-primary-foreground" : ""}`}
              onClick={() => setSelectChat(user)}
            >
              <div className="left-side flex">
                <Avatar>
                  <AvatarImage src={user.image ?? "https://github.com/shadcn.png"} />
                  <AvatarFallback>{user.username}</AvatarFallback>
                </Avatar>
                <div className="chat ml-2 flex-col">
                  <div className="name">{user.name}</div>
                  <div className="message text-xs text-gray-400">{user.bio}</div>
                </div>
              </div>
            </div>
            <Separator className="my-2" />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ChatSearchContactsTab;
