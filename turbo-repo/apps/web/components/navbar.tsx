import React from "react";
import { AudioLines } from "lucide-react";
import UserAvatar from "./user-avatar";
import LogoutButton from "./logout-button";
import { currentUser } from "../app/helpers/auth";

const Navbar = async () => {
  const user = await currentUser();
  return (
    <nav className="flex items-center justify-between mx-10 mt-2">
      <header className="flex items-center text-xl align-middle font-sans font-bold antialiased relative">
        <AudioLines className="mr-2 inline text-white" />
        <span className="text-white"> Meet</span> <span className="text-sky-400/100"> ChillChat</span>
      </header>

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

export default Navbar;
