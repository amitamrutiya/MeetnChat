import { Button, Label, Switch } from "@repo/ui";
import { AudioLines, PhoneCallIcon, VideoIcon } from "lucide-react";
import Image from "next/image";

function ChatRoomProfileSction() {
  return (
    <div className="flex flex-col justify-between h-full">
      <div className="flex flex-col mt-6 justify-center items-center">
        <Image
          src="https://github.com/shadcn.png"
          alt="logo"
          width={208}
          height={208}
          className="rounded-3xl"
        />
        <h1 className="text-xl font-bold text-white mt-4">John Doe</h1>
        <p className="text-gray-400 text-sm">Online</p>
        <div className="flex space-x-7">
          <button className="my-6 transition duration-500 ease-in-out bg-green-500 hover:bg-white hover:text-green-500 text-white font-bold py-2 px-4 rounded-full inline-flex items-center">
            <VideoIcon className="h-10 w-10" />
          </button>
          <button className="my-6 transition duration-500 ease-in-out bg-green-500 hover:bg-white hover:text-green-500 text-white font-bold py-2 px-4 rounded-full inline-flex items-center">
            <PhoneCallIcon className="h-10 w-10" />
          </button>
        </div>
        <div className="flex flex-col w-full justify-between space-y-4">
          <div className="flex justify-evenly w-full space-x-2">
            <Label htmlFor="airplane-mode">Notification</Label>
            <Switch id="airplane-mode" />
          </div>
          <ChatProfileTile
            title="Bio"
            subtitle="Love to Chat"
          ></ChatProfileTile>
          <ChatProfileTile
            title="Phone Number"
            subtitle="+91 95465 32658"
          ></ChatProfileTile>
          <ChatProfileTile
            title="User Name"
            subtitle="@johndoe"
          ></ChatProfileTile>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <Button variant="secondary" className="rounded-3xl px-10 my-4">
          Edit Contect
        </Button>
        <Button variant="secondary" className="rounded-3xl px-10">
          Block
        </Button>
        <footer className="flex items-center justify-center text-xl my-6 align-middle font-sans font-bold antialiased">
          <AudioLines className="mr-2 inline" />
          Meet <span className="text-sky-400/100"> ChillChat</span>
        </footer>
      </div>
    </div>
  );
}

export default ChatRoomProfileSction;

interface ChatProfileTileProps {
  title: string;
  subtitle: string;
}

const ChatProfileTile: React.FC<ChatProfileTileProps> = ({
  title,
  subtitle,
}) => {
  return (
    <div className="flex flex-col px-7 w-full justify-evenly ">
      <h2 className="text-md font-bold">{title}</h2>
      <p className="text-gray-500 text-sm">{subtitle}</p>
    </div>
  );
};
