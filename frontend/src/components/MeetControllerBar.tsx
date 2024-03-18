import React, { useContext, useState, useEffect } from "react";
import {
  LucideScreenShare,
  LucideScreenShareOff,
  MicIcon,
  MicOffIcon,
  VideoIcon,
  VideoOffIcon,
  CircleIcon,
  PresentationIcon,
} from "lucide-react";
import {
  MediaScreenStreamContext,
  ProviderScreenProps,
} from "@/app/context/ScreenStream";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { MediaStreamContext, ProviderProps } from "@/app/context/MediaStream";
import { Button } from "./ui/button";
import {
  AudioVideoStreamContext,
  AudioVideoStreamProps,
} from "@/app/context/AudioVideoStream";
import EndMeetButton from "./EndMeetButton";
import SettingButton from "./SettingButton";
import { useStartUserStream } from "@/app/hooks/useStartStream";
import { useStopUserStream } from "@/app/hooks/useStopStream";
import ChatButton from "./ChatButton";

const MeetControllerBar = () => {
  const { audio, video, setAudio, setVideo } = React.useContext(
    AudioVideoStreamContext
  ) as AudioVideoStreamProps;
  const { userStream } = useContext(MediaStreamContext) as ProviderProps;

  const { userScreenStream } = React.useContext(
    MediaScreenStreamContext
  ) as ProviderScreenProps;

  const [whiteboard, setWhiteboard] = useState<boolean>(true);

  const { handleStartAudioVideoStream, handleStartScreenShareStream } =
    useStartUserStream();
  const { handleStopScreenShareStream, handleStopAudioVideoStream } =
    useStopUserStream();

  useEffect(() => {
    if (!audio && !video) {
      handleStopAudioVideoStream();
    }

    return () => {};
  }, [audio, handleStopAudioVideoStream, video]);

  return (
    <div className="flex flex-row ">
      <div className="sm:w-auto rounded-lg bg-slate-600 px-3 mx-auto py-2">
        <div
          className="flex flex-row h-full w-full items-center justify-center gap-4"
          id="tools-container"
        >
          {/* Audio Button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  size={"icon"}
                  className={audio ? "bg-primary" : "bg-foreground"}
                  onClick={() => {
                    setAudio(!audio);
                    if (!userStream) {
                      handleStartAudioVideoStream();
                      return;
                    }
                    const audioTrack = userStream?.getTracks()[0];
                    if (audioTrack) {
                      audioTrack.enabled = !audioTrack.enabled;
                    }
                  }}
                >
                  {audio ? <MicIcon /> : <MicOffIcon />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{audio ? "Stop audio" : "Start audio"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Video Button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  size={"icon"}
                  className={video ? "bg-primary" : "bg-foreground"}
                  onClick={() => {
                    if (!userStream) {
                      setVideo(true);
                      setAudio(true);
                      handleStartAudioVideoStream();
                      return;
                    }
                    setVideo(!video);
                    const videoTrack = userStream?.getTracks()[1];
                    if (videoTrack) {
                      videoTrack.enabled = !videoTrack.enabled;
                    }
                  }}
                >
                  {video ? <VideoIcon /> : <VideoOffIcon />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{video ? "Stop video" : "Start video"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Screen Share Button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  size={"icon"}
                  className={userScreenStream ? "bg-primary" : "bg-foreground"}
                  onClick={
                    userScreenStream
                      ? handleStopScreenShareStream
                      : handleStartScreenShareStream
                  }
                >
                  {userScreenStream ? (
                    <LucideScreenShare />
                  ) : (
                    <LucideScreenShareOff />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {userScreenStream
                    ? "Stop screen share"
                    : "Start screen share"}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Chat Button */}
          <ChatButton remoteSocketId="asfdafe" />

          {/* recording button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button size={"icon"} className="bg-foreground">
                  <CircleIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Start Record</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* whiteboard button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  size={"icon"}
                  className={whiteboard ? "bg-primary" : "bg-foreground"}
                  onClick={() => setWhiteboard(!whiteboard)}
                >
                  <PresentationIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Whiteboard</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Setting Button */}
          <SettingButton />

          {/* End Call Button */}
          <EndMeetButton />
        </div>
      </div>
    </div>
  );
};

export default MeetControllerBar;
