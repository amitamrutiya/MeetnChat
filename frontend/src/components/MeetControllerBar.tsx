import React, { useContext, useState } from "react";
import {
  LucideScreenShare,
  LucideScreenShareOff,
  MicIcon,
  MicOffIcon,
  VideoIcon,
  VideoOffIcon,
  CircleIcon,
  PresentationIcon,
  SettingsIcon,
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

export interface ScreenShareProps {
  onStartScreenShare?: () => void;
  onStopScreenShare?: () => void;
  onStartAudioVideoStream: (
    audioDeviceId?: string,
    videoDeviceId?: string
  ) => void;
  onStopAudioVideoStream: () => void;
}

const ScreenShare: React.FC<ScreenShareProps> = (props) => {
  const {
    onStartScreenShare,
    onStopScreenShare,
    onStartAudioVideoStream,
    onStopAudioVideoStream,
  } = props;

  const { audio, video, setAudio, setVideo } = React.useContext(
    AudioVideoStreamContext
  ) as AudioVideoStreamProps;
  const { userStream } = useContext(MediaStreamContext) as ProviderProps;

  const { userScreenStream } = React.useContext(
    MediaScreenStreamContext
  ) as ProviderScreenProps;

  const [whiteboard, setWhiteboard] = useState<boolean>(true);

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
                      onStartAudioVideoStream();
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
                      onStartAudioVideoStream();
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
                    userScreenStream ? onStopScreenShare : onStartScreenShare
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
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button className="bg-foreground ml-5">
                  <SettingsIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Change Setting</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* End Call Button */}
          <EndMeetButton onStopAudioVideoStream={onStopAudioVideoStream} />
        </div>
      </div>
    </div>
  );
};

export default ScreenShare;
