"use client";

import React, { useState } from "react";
import ReactPlayer from "react-player";
import AudioVideoBar from "./audio-video-bar";
import MeetControllerBar from "./meet-controller-bar";
import { User } from "@prisma/client";
import { PinIcon } from "lucide-react";
import { useRecoilValue } from "recoil";
import { remoteStreamsAtom, userScreenStreamAtom, userStreamAtom } from "@repo/store";

interface DashboardProps {
  remoteSocketId: string;
  whiteboardID?: string | null;
  remoteUser?: User;
}

const MeetDashboard: React.FC<DashboardProps> = (props) => {
  const { remoteSocketId, whiteboardID, remoteUser } = props;
  const userStream = useRecoilValue(userStreamAtom);
  const remoteStreams = useRecoilValue(remoteStreamsAtom);
  const userScreenStream = useRecoilValue(userScreenStreamAtom);

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
    <div className="mt-5 text-white">
      <div className="grid grid-cols-1 gap-2 lg:grid-cols-3">
        <div className="xs:col-span-1 sm:col-span-1 md:col-span-2 lg:col-span-2">
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
                className="hid den absolute left-0 right-0 top-[50%] group-hover:block"
                onClick={handleUnPinVideo}
              >
                <PinIcon className="m-auto" />
              </button>
            </div>
          ) : (
            <iframe src={`https://witeboard.com/${whiteboardID}`} height="100%" width="100%" />
          )}
        </div>
        <div className="xs:col-span-1 sm:col-span-1 md:col-span-1 lg:col-span-1">
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
