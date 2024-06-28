"use client";

import React from "react";
import { AudioLines, ArrowLeftRightIcon } from "lucide-react";
import UserAvatar from "./UserAvatar";
import LogoutButton from "./LogoutButton";
import { User } from "@/type";
import { useSession } from "next-auth/react";

export interface RoomNavbarProps {
  remoteUser?: User | undefined | null;
  remoteSocketId?: string | undefined | null;
}

const RoomNavbar: React.FC<RoomNavbarProps> = (props) => {
  const { remoteUser, remoteSocketId } = props;
  const session = useSession();
  const user = session.data?.user;

  return (
    <nav className="flex items-center justify-between mx-10 mt-2">
      <header className="flex items-center text-xl align-middle font-sans font-bold antialiased relative">
        <AudioLines className="mr-2 inline" />
        Meet <span className="text-sky-400/100"> ChillChat</span>
      </header>
      {user && remoteSocketId && (
        <div>
          <div className="mx-5 mt-4 flex items-center text-white">
            <UserAvatar
              username={user?.fullname || user.email || "Someone"}
              src={user?.profile_image || ""}
              height={40}
              width={40}
            />
            <ArrowLeftRightIcon fontSize={20} />
            {remoteUser ? (
              <UserAvatar
                username={remoteUser?.name || "Someone"}
                src={remoteUser?.picture || ""}
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
              username={user?.username || user?.email || "Someone"}
              src={user?.profile_image || ""}
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
