import React from "react";
import ReactPlayer from "react-player";
import { MediaStreamContext, ProviderProps } from "@/app/context/MediaStream";
import { Button } from "./ui/button";

interface AudioVideoBarProps {
  pinVideoObj: MediaStream | null;
  onStartAudioVideo?: () => void;
  pinVideo: (id: string) => void;
  unPinVideo: () => void;
}

const AudioVideoBar: React.FC<AudioVideoBarProps> = (props) => {
  const { pinVideoObj, onStartAudioVideo, pinVideo, unPinVideo } = props;
  const { userStream, remoteStreams } = React.useContext(
    MediaStreamContext
  ) as ProviderProps;

  return (
    <div className="h-full w-full rounded-md bg-transparent">
      <div className="video-player-container w-full rounded-md">
        {userStream ? (
          <>
            {pinVideoObj?.id !== userStream.id && (
              <div className="group relative">
                <ReactPlayer
                  width="100%"
                  height="100%"
                  url={userStream}
                  muted={false}
                  playing
                  controls={false}
                  className="opacity-100 group-hover:opacity-50"
                />
                {pinVideoObj && pinVideoObj.id == userStream.id ? (
                  <button
                    className="absolute top-[50%] left-0 right-0 hidden group-hover:block"
                    onClick={unPinVideo}
                  >
                    <Button className="m-auto" title="UnPin video" />
                  </button>
                ) : (
                  <button
                    className="absolute top-[50%] left-0 right-0 hidden group-hover:block"
                    onClick={() => pinVideo(userStream.id)}
                  >
                    <Button className="m-auto" title="Pin video" />
                  </button>
                )}
              </div>
            )}
          </>
        ) : (
          <div
            onClick={onStartAudioVideo}
            className="flex h-48 w-full cursor-pointer items-center justify-center rounded-md bg-slate-500"
          >
            <div className="text-center text-lg">
              <Button className="mx-auto" />
              <div className="my-5" />
              <div>
                <h3>Your video is turned off.</h3>
                <caption about="caption">Click to turn on</caption>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="my-5" />
      <div className="video-player-container w-full rounded-md">
        {remoteStreams
          .filter((stream) => stream.id !== pinVideoObj?.id)
          .map((stream) => (
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
                {pinVideoObj && pinVideoObj.id == stream.id ? (
                  <button
                    className="absolute top-[50%] left-0 right-0 hidden group-hover:block"
                    onClick={unPinVideo}
                  >
                    <Button className="m-auto" title="UnPin video" />
                  </button>
                ) : (
                  <button
                    className="absolute top-[50%] left-0 right-0 hidden group-hover:block"
                    onClick={() => pinVideo(stream.id)}
                  >
                    <Button className="m-auto" title="Pin video" />
                  </button>
                )}
              </div>
            </>
          ))}
      </div>
    </div>
  );
};

export default AudioVideoBar;
