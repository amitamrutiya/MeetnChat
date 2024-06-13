"use client";

import React from "react";
import ReactPlayer from "react-player";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { User } from "@/type";
import { MediaStreamContext, ProviderProps } from "@/app/context/MediaStream";
import AudioVideoButton from "./AudioVideoButton";
import ChatButton from "./ChatButton";
import SettingButton from "./SettingButton";
import EndMeetButton from "./EndMeetButton";
import { useSession } from "next-auth/react";

interface DashboardProps {
  remoteSocketId: string;
  whiteboardID?: string | null;
  remoteUser?: User;
}

const Dashboard: React.FC<DashboardProps> = (props) => {
  const { remoteSocketId, remoteUser } = props;
  const session = useSession();
  const user = session.data?.user;
  const { userStream, remoteStreams } = React.useContext(
    MediaStreamContext
  ) as ProviderProps;

  return (
    <div className="flex flex-col mx-[20%]">
      <div className="mb-10 h-[74vh] overflow-auto">
        <div className="h-full w-full rounded-md bg-transparent flex justify-center items-center ">
          <div className=" bg-foreground h-[55%] w-[50%] flex justify-center items-center border-8 border-blue-500 rounded-xl shadow-lg p-4">
            {userStream ? (
              <>
                (
                <div className="group relative flex justify-center">
                  <ReactPlayer
                    url={userStream}
                    muted={false}
                    playing
                    controls={false}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <span className="absolute top-[80%] left-0 right-0 hidden group-hover:block">
                    {"You"}
                  </span>
                </div>
                )
              </>
            ) : (
              <Avatar className="h-36 w-36">
                <AvatarImage
                  src={user?.image?.toString() ?? "/user.png"}
                  alt="User"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            )}
          </div>
          <div className="my-3 px-3" />
          <div className="bg-foreground h-[55%] w-[50%] flex justify-center items-center border-8 border-blue-500 rounded-xl shadow-lg p-4">
            {remoteStreams.length > 0 ? (
              <div>
                {remoteStreams.map((stream) => (
                  <>
                    <div className="my-5" />
                    <div className="group relative">
                      <ReactPlayer
                        key={stream.id}
                        width="100%"
                        height="100%"
                        url={stream}
                        muted={false}
                        playing
                        controls={false}
                        pip
                        className="opacity-100 group-hover:opacity-50"
                      />
                    </div>
                  </>
                ))}
              </div>
            ) : (
              <Avatar className="h-36 w-36">
                <AvatarImage
                  src={remoteUser?.picture?.toString() ?? "/user.png"}
                  alt="User"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-row">
        <div className="sm:w-auto rounded-lg bg-slate-600 px-3 mx-auto py-2">
          <div className="flex flex-row h-full w-full items-center justify-center gap-4">
            <AudioVideoButton />
            <ChatButton remoteSocketId={remoteSocketId} />
            <SettingButton />
            <EndMeetButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
