"use client";

import React, { useState } from "react";
import ReactPlayer from "react-player";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiFillPushpin } from "react-icons/ai";
import AudioVideoBar from "./AudioVideoBar";
import {
  MediaScreenStreamContext,
  ProviderScreenProps,
} from "@/app/context/ScreenStream";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { User } from "@/type";
import MeetControllerBar from "./MeetControllerBar";
import { useUser } from "@auth0/nextjs-auth0/client";
import { MediaStreamContext, ProviderProps } from "@/app/context/MediaStream";

interface DashboardProps {
  remoteSocketId: string;
  whiteboardID?: string | null;
  remoteUser?: User;
}

const Dashboard: React.FC<DashboardProps> = (props) => {
  const { remoteSocketId, remoteUser } = props;
  const { user } = useUser();

  const { userStream, remoteStreams } = React.useContext(
    MediaStreamContext
  ) as ProviderProps;

  return (
    <div className="mt-5  text-white">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
        <div className="lg:col-span-1 md:col-span-1 sm:col-span-1 xs:col-span-1">
          <div className="mb-2 h-[74vh] overflow-auto">
            <div className="h-full w-full rounded-md bg-transparent flex flex-col items-center ">
              <div className=" bg-foreground h-[45%] w-[69%] flex justify-center items-center border-8 border-blue-500 rounded-xl shadow-lg p-4">
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
                      src={user?.picture?.toString() ?? "/user.png"}
                      alt="User"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                )}
              </div>
              <div className="my-3" />
              <div className="bg-foreground h-[45%] w-[69%] flex justify-center items-center border-8 border-blue-500 rounded-xl shadow-lg p-4">
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
            </div>{" "}
          </div>
          <MeetControllerBar remoteSocketId={remoteSocketId} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
