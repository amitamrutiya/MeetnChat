"use client";

import React from "react";
import { AudioLines, ArrowLeftRightIcon } from "lucide-react";
import UserAvatar from "./UserAvatar";
import LogoutButton from "./LogoutButton";
import { useSession } from "next-auth/react";
import { useRoom } from "@/app/hooks/useRoom";
import { User } from "@/type";

export interface RoomNavbarProps {
  remoteUser?: User | undefined | null;
  remoteSocketId?: string | undefined | null;
}

const RoomNavbar: React.FC<RoomNavbarProps> = (props: RoomNavbarProps) => {
  const { remoteUser, remoteSocketId } = props;
  const session = useSession();
  const user = session.data?.user;

  return (
    <nav className="flex w-full items-center justify-between">
      <header className="flex items-center text-xl align-middle font-sans font-bold antialiased relative">
        <AudioLines className="mr-2 inline" />
        Meet <span className="text-sky-400/100"> ChillChat</span>
      </header>
      {user && remoteSocketId && (
        <div>
          <div className="mt-4 flex gap-3 items-center text-white">
            <UserAvatar
              username={user?.name || user?.email || "Someone"}
              src={user?.image || ""}
              height={40}
              width={40}
            />
            <ArrowLeftRightIcon fontSize={20} />
            {remoteUser ? (
              <UserAvatar
                username={remoteUser?.name || remoteUser?.email || "Someone"}
                src={remoteUser?.image || ""}
                height={40}
                width={40}
              />
            ) : (
              <p>Disconnected</p>
            )}
          </div>
        </div>
      )}

      <div className="mt-4 flex space-x-4">
        {user && (
          <>
            <UserAvatar
              username={user?.name || user?.email || "Someone"}
              src={user?.image || ""}
              height={40}
              width={40}
            />
            <LogoutButton user={user} />
          </>
        )}
      </div>
    </nav>
  );
};

export default RoomNavbar;
