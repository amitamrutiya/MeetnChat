"use client";

import React, { useState } from "react";
import ReactPlayer from "react-player";
import { AiFillPushpin } from "react-icons/ai";
import AudioVideoBar from "./AudioVideoBar";
import { MediaStreamContext, ProviderProps } from "@/app/context/MediaStream";
import {
  MediaScreenStreamContext,
  ProviderScreenProps,
} from "@/app/context/ScreenStream";
import MeetControllerBar from "./MeetControllerBar";
import {  User } from "@/type";

interface DashboardProps {
  remoteSocketId: string;
  whiteboardID?: string | null;
  remoteUser?: User;
}

const MeetDashboard: React.FC<DashboardProps> = (props) => {
  const { remoteSocketId, whiteboardID, remoteUser } = props;

  const { userStream, remoteStreams } = React.useContext(
    MediaStreamContext
  ) as ProviderProps;

  const { userScreenStream } = React.useContext(
    MediaScreenStreamContext
  ) as ProviderScreenProps;

  const [pinVideo, setPinVideo] = useState<MediaStream | null>(null);

  const handlePinVideo = React.useCallback(
    (id: string) => {
      const foundStream = remoteStreams.find((stream) => stream.id == id);
      if (foundStream) {
        setPinVideo(foundStream);
      } else if (userStream && userStream.id == id) {
        setPinVideo(userStream);
      } else if (userScreenStream && userScreenStream.id == id) {
        setPinVideo(userScreenStream);
      }
    },
    [userStream, remoteStreams, userScreenStream]
  );

  const handleUnPinVideo = React.useCallback(() => {
    setPinVideo(null);
  }, []);

  return (
    <div className="mt-5  text-white">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
        <div className="lg:col-span-2 md:col-span-2 sm:col-span-1 xs:col-span-1">
          {pinVideo ? (
            <div className="group relative">
              <ReactPlayer
                key={pinVideo.id}
                width="100%"
                height="100%"
                url={pinVideo}
                playing
                controls={true}
                pip
                muted={pinVideo.id === userStream?.id}
              />
              <button
                className="absolute top-[50%] left-0 right-0 hid  den group-hover:block"
                onClick={handleUnPinVideo}
              >
                <AiFillPushpin
                  className="m-auto"
                  size={30}
                  title="UnPin video"
                />
              </button>
            </div>
          ) : (
            <iframe
              src={`https://witeboard.com/${whiteboardID}`}
              height="100%"
              width="100%"
            />
          )}
        </div>
        <div className="lg:col-span-1 md:col-span-1 sm:col-span-1 xs:col-span-1">
          <div className="mb-2 h-[74vh] overflow-auto">
            <AudioVideoBar
              pinVideoObj={pinVideo}
              pinVideo={handlePinVideo}
              unPinVideo={handleUnPinVideo}
              remoteUser={remoteUser}
            />
          </div>
          <MeetControllerBar remoteSocketId={remoteSocketId} />
        </div>
      </div>
    </div>
  );
};

export default MeetDashboard;
