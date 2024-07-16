"use client";

import { Input, Avatar, AvatarImage, AvatarFallback } from "@repo/ui";
import { SettingsIcon, SearchIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getUserById } from "app/actions/user/get-user";
import EditProfileDialoge from "components/edit-profile-dialoge";
import ChatSearchInviteTab from "./chat-search-invite-tab";
import ChatSearchContactsTab from "./chat-search-contacts-tab";
import ChatSearchMainTab from "./chat-search-main-tab";
import ChatSearchNavButton from "./chat-search-nav-button";
import { chat } from "hooks/use-chat";
import { useWebSocket } from "components/web-socket-context";

function ChatRoomSearchSection() {
  const currentUser = useSession().data?.user;
  const [settingDialog, setSettingDialog] = useState<boolean>(false);
  const { ws } = useWebSocket();
  const {
    fetchFrequentChatUsers,
    selectedTab,
    setLoading,
    loading,
    setRequestUserData,
    setContacts,
    setInviteUserData,
  } = chat();

  useEffect(() => {
    if (!ws) return;
    ws.onmessage = async (event) => {
      const message = JSON.parse(event.data);
      console.log("Received message asdf", message.payload);
      switch (message.type) {
        case "NEW_FRIEND_REQUESTED": {
          const user = await getUserById({ user_id: message.payload.receiver_id });
          if (user) {
            setRequestUserData((prev) => new Map([...(prev ?? []), [message.payload.request_id, user]]));
          }
          break;
        }
        case "ACCEPTED_FRIEND_REQUEST": {
          const user = await getUserById({ user_id: message.payload.sender_id });
          if (user) {
            setContacts((prev) => [...prev, user]);
            // Update status to accepted
            setInviteUserData((prev) => {
              const newMap = new Map(prev);
              const keys = Array.from(newMap.keys());
              keys.forEach((key) => {
                const user = newMap.get(key);
                if (user?.id === message.payload.sender_id) {
                  const parts = key.split("-");
                  parts[5] = "Accepted";
                  const newStatusKey = parts.join("-");
                  newMap.delete(key);
                  newMap.set(newStatusKey, user!);
                }
              });
              return newMap;
            });
          }
          break;
        }
        case "REJECTED_FRIEND_REQUEST": {
          const user = await getUserById({ user_id: message.payload.sender_id });

          if (user) {
            setInviteUserData((prev) => {
              const newMap = new Map(prev);
              const keys = Array.from(newMap.keys());
              keys.forEach((key) => {
                const user = newMap.get(key);
                if (user?.id === message.payload.sender_id) {
                  const parts = key.split("-");
                  parts[5] = "Rejected";
                  const newStatusKey = parts.join("-");
                  newMap.delete(key);
                  newMap.set(newStatusKey, user!);
                }
              });
              return newMap;
            });
          }
          break;
        }
        default:
          break;
      }
    };

    return () => {
      ws.onmessage = null;
    };
  }, [ws]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchFrequentChatUsers();
      setLoading(false);
    };

    fetchData();
  }, [currentUser]);

  return (
    <div className="flex h-full flex-col justify-between">
      <div>
        <div className="Search mb-8 p-5">
          <div className="grid w-full max-w-full items-center gap-1.5">
            <div className="flex w-full items-center space-x-2 rounded-lg px-3">
              <Input type="search" placeholder="Search" className="h-8 w-full border-0 font-semibold" />
              <SearchIcon className="h-4 w-4" />
            </div>
          </div>
        </div>
        <ChatSearchNavButton />
      </div>
      {selectedTab === "Chats" && <ChatSearchMainTab />}
      {selectedTab === "Contacts" && <ChatSearchContactsTab />}
      {selectedTab === "Invite" && <ChatSearchInviteTab />}

      {selectedTab === null && loading && (
        <div className="flex h-full items-center justify-center">
          <div className="loader h-24 w-24 animate-spin rounded-full border-8 border-t-8 border-gray-200 ease-linear"></div>
        </div>
      )}

      <div className="profile bg-secondary mx-6 mb-6 flex items-center justify-between gap-3 rounded-full">
        <div className="flex flex-row items-center">
          <Avatar className="h-[70px] w-[70px]">
            <AvatarImage src={currentUser?.image ?? "https://github.com/shadcn.png"} />
            <AvatarFallback>{currentUser?.username}</AvatarFallback>
          </Avatar>
          <div className="chat ml-5 flex-col">
            <div className="name">{currentUser?.name}</div>
            <div className="message text-sm text-gray-400">{currentUser?.is_online ? "Online" : "Offline"}</div>
          </div>
        </div>
        <div className="pr-6">
          <SettingsIcon className="cursor-pointer" onClick={() => setSettingDialog((prev) => !prev)} />
          <EditProfileDialoge isOpen={settingDialog} setIsOpen={setSettingDialog} />
        </div>
      </div>
    </div>
  );
}

export default ChatRoomSearchSection;
