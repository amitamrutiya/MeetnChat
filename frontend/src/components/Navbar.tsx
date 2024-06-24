"use client";

import React from "react";
import { AudioLines, ArrowLeftRightIcon } from "lucide-react";
import { User } from "@/type";
import UserAvatar from "./UserAvatar";
import { useSession } from "next-auth/react";
import LogoutButton from "./LogoutButton";

export interface NavbarProps {
  remoteUser?: User | undefined | null;
  remoteSocketId?: string | undefined | null;
}

const Navbar: React.FC<NavbarProps> = (props) => {
  const { remoteUser, remoteSocketId } = props;
  const session = useSession();
  const currentUser = session.data?.user;

  return (
    <nav className="flex items-center justify-between mx-10 mt-2">
      <header className="flex items-center text-xl align-middle font-sans font-bold antialiased relative">
        <AudioLines className="mr-2 inline" />
        Connect <span className="text-sky-400/100"> Friends</span>
      </header>
      {currentUser && remoteSocketId && (
        <div>
          <div className="mx-5 mt-4 flex items-center text-white">
            <UserAvatar
              username={currentUser?.name || currentUser.email || "Someone"}
              src={currentUser?.image || ""}
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
        {currentUser && (
          <>
            <UserAvatar
              username={currentUser?.name || currentUser?.email || "Someone"}
              src={currentUser?.image || ""}
              height={40}
              width={40}
            />
            <LogoutButton />
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
