"use client";

import { selectChatAtom } from "@repo/store";
import { Avatar, AvatarImage, AvatarFallback, Separator } from "@repo/ui";
import { useChat } from "hooks/use-chat";
import React from "react";
import { useRecoilState } from "recoil";

const ChatSearchMainTab = () => {
  const { frequentChatUsers } = useChat();
  const [selectChat, setSelectChat] = useRecoilState(selectChatAtom);

  return (
    <div className="ChatList mb-10 h-full overflow-auto rounded-md border">
      <div className="p-4">
        <h4 className="text-md my-3 text-center font-bold leading-none">Your Recent Chat</h4>
        {frequentChatUsers.map((user) => (
          <React.Fragment key={user.id}>
            <div
              className={`flex cursor-pointer justify-between rounded-xl p-3 ${selectChat?.id === user.id ? "bg-primary-foreground" : ""}`}
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
              <div className="right-side text-xs text-gray-400">03:36</div>
            </div>
            <Separator className="my-2" />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ChatSearchMainTab;
