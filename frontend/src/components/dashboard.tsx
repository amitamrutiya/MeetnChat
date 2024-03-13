import React, { useState } from "react";
import ReactPlayer from "react-player";
import { MediaStreamContext, ProviderProps } from "@/app/context/MediaStream";
import { Button } from "./ui/button";
import AudioVideoBar from "./AudioVideoBar";

interface DashboardProps {
  startAudioVideoStreams?: () => void;
  remoteSocketId?: string;
  whiteboardID?: string | null;
}

const Dashboard: React.FC<DashboardProps> = (props) => {
  const { startAudioVideoStreams, remoteSocketId, whiteboardID } = props;

  const { userStream, remoteStreams } = React.useContext(
    MediaStreamContext
  ) as ProviderProps;

  const [fileTransferOpen, setFileTransferOpen] = useState<boolean>(false);
  const [pinVideo, setPinVideo] = useState<MediaStream | null>(null);

  const handlePinVideo = React.useCallback(
    (id: string) => {
      const foundStream = remoteStreams.find((stream) => stream.id == id);
      if (foundStream) {
        setPinVideo(foundStream);
      } else if (userStream && userStream.id == id) {
        setPinVideo(userStream);
      }
    },
    [userStream, remoteStreams]
  );

  const handleUnPinVideo = React.useCallback(() => {
    setPinVideo(null);
  }, []);

  return (
    <div className="mt-5  text-white">
      {pinVideo ? (
        <div className="group relative">
          <ReactPlayer
            key={pinVideo.id}
            width="100%"
            height="100%"
            url={pinVideo}
            playing
            controls={false}
            pip
            muted={pinVideo.id === userStream?.id}
          />
          <button
            className="absolute top-[50%] left-0 right-0 hidden group-hover:block"
            onClick={handleUnPinVideo}
          >
            <Button className="m-auto" title="UnPin video" />
          </button>
        </div>
      ) : (
        <div>Not perfectly connected</div>
      )}

      <div className="mb-2 h-[74vh] overflow-auto">
        <AudioVideoBar
          pinVideoObj={pinVideo}
          onStartAudioVideo={startAudioVideoStreams}
          pinVideo={handlePinVideo}
          unPinVideo={handleUnPinVideo}
        />
      </div>
    </div>
  );
};

export default Dashboard;
