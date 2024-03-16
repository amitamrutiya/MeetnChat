import React from "react";
import { AudioLines, ArrowLeftRightIcon } from "lucide-react";
import { User } from "@/type";
import { UserProfile, useUser } from "@auth0/nextjs-auth0/client";
import UserAvatar from "./UserAvatar";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export interface NavbarProps {
  remoteUser?: User | undefined | null;
  remoteSocketId?: string | undefined | null;
}

const Navbar: React.FC<NavbarProps> = (props) => {
  const router = useRouter();
  const { remoteUser, remoteSocketId } = props;
  const { user } = useUser();
  const currentUser = user as UserProfile | undefined;

  return (
    <nav className="flex items-center justify-between">
      <header className="flex items-center text-xl align-middle font-sans font-bold antialiased">
        <AudioLines className="mr-2 inline" />
        Connect <span className="text-sky-400/100"> Friends</span>
      </header>
      {currentUser && remoteSocketId && (
        <div>
          <div className="mx-5 mt-4 flex items-center text-white">
            <UserAvatar
              username={currentUser?.name || currentUser.email || "Someone"}
              src={currentUser?.picture || ""}
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
      {currentUser && (
        <>
          <div className="mx-6 mt-4 flex">
            <UserAvatar
              username={currentUser?.name || currentUser?.email || "Someone"}
              src={currentUser?.picture || ""}
              height={40}
              width={40}
            />

            <Button
              className="ml-5"
              onClick={() => router.push("/api/auth/logout")}
            >
              LogOut
            </Button>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
