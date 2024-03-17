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
    <div>
      <div className="h-[5vh] w-full  rounded-lg bg-slate-600">
        <div
          className="flex h-full w-full items-center justify-center"
          id="tools-container"
        >
          {/* Audio Button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button
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
                  className={video ? "bg-primary ml-5" : "bg-foreground ml-5"}
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
                  className={
                    userScreenStream ? "bg-primary ml-5" : "bg-foreground ml-5"
                  }
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

          {/* recording button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button className="bg-foreground ml-5">
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
                  className={
                    whiteboard ? "bg-primary ml-5" : "bg-foreground ml-5"
                  }
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
