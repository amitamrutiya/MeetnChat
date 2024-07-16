"use client";

import { Button, Label, Switch } from "@repo/ui";
import { PhoneCallIcon, VideoIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import EditProfileDialoge from "../../../../components/edit-profile-dialoge";
import { AudioLines } from "lucide-react";
import ChangePasswordDialoge from "../../../../components/change-password-dialoge";

function ChatRoomProfileSction() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [changePasswordDialoge, setChangePasswordDialoge] = useState<boolean>(false);
  const currentUser = useSession().data?.user;

  return (
    <div className="flex h-full flex-col justify-between">
      <div className="mt-6 flex flex-col items-center justify-center">
        <Image
          src={currentUser?.image ?? "https://github.com/shadcn.png"}
          alt="logo"
          width={208}
          height={208}
          className="rounded-3xl"
        />
        <h1 className="mt-4 text-xl font-bold text-white">{currentUser?.name}</h1>
        <p className="text-sm text-gray-400">{currentUser?.is_online ? "Online" : "Offline"}</p>
        <div className="flex space-x-7">
          <button className="my-6 inline-flex items-center rounded-full bg-green-500 px-4 py-2 font-bold text-white transition duration-500 ease-in-out hover:bg-white hover:text-green-500">
            <VideoIcon className="h-10 w-10" />
          </button>
          <button className="my-6 inline-flex items-center rounded-full bg-green-500 px-4 py-2 font-bold text-white transition duration-500 ease-in-out hover:bg-white hover:text-green-500">
            <PhoneCallIcon className="h-10 w-10" />
          </button>
        </div>
        <div className="flex w-full flex-col justify-between space-y-4">
          <div className="flex w-full justify-evenly space-x-2">
            <Label htmlFor="airplane-mode" className="text-white">
              Notification
            </Label>
            <Switch id="airplane-mode" />
          </div>
          <ChatProfileTile title="Bio" subtitle={currentUser?.bio ?? "Love to chat"}></ChatProfileTile>
          <ChatProfileTile
            title="Phone Number"
            subtitle={currentUser?.phone_number ?? "+919999999999"}
          ></ChatProfileTile>
          <ChatProfileTile title="User Name" subtitle={currentUser?.username!}></ChatProfileTile>
        </div>
      </div>
      <footer className="my-6 flex flex-col items-center justify-center gap-2 align-middle font-sans text-xl font-bold antialiased">
        <Button
          variant="secondary"
          className="rounded-3xl border-2 border-white px-10"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          Edit Contact
        </Button>
        <EditProfileDialoge isOpen={isOpen} setIsOpen={setIsOpen} />
        <ChangePasswordDialoge isOpen={changePasswordDialoge} setIsOpen={setChangePasswordDialoge} />
        <Button
          variant="outline"
          className="rounded-3xl px-10"
          onClick={() => setChangePasswordDialoge((prev) => !prev)}
        >
          Change Password
        </Button>
        <div className="mt-4 flex">
          <AudioLines className="mr-2 inline" />
          Meet <span className="text-sky-400/100"> ChillChat</span>
        </div>
      </footer>
    </div>
  );
}

export default ChatRoomProfileSction;

interface ChatProfileTileProps {
  title: string;
  subtitle: string;
}

const ChatProfileTile: React.FC<ChatProfileTileProps> = ({ title, subtitle }) => {
  return (
    <div className="flex w-full flex-col justify-evenly px-7">
      <h2 className="text-md font-bold">{title}</h2>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </div>
  );
};
