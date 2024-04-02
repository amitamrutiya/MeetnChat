import React, { useContext, useEffect } from "react";
import { MicIcon, MicOffIcon, VideoIcon, VideoOffIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AudioVideoStreamContext,
  AudioVideoStreamProps,
} from "@/app/context/AudioVideoStream";
import { MediaStreamContext, ProviderProps } from "@/app/context/MediaStream";
import { useStartUserStream } from "@/app/hooks/useStartStream";
import { useStopUserStream } from "@/app/hooks/useStopStream";

import { Button } from "./ui/button";

function AudioVideoButton() {
  const { audio, video, setAudio, setVideo } = React.useContext(
    AudioVideoStreamContext
  ) as AudioVideoStreamProps;
  const { userStream } = useContext(MediaStreamContext) as ProviderProps;

  const { handleStartAudioVideoStream } = useStartUserStream();
  const { handleStopAudioVideoStream } = useStopUserStream();

  useEffect(() => {
    if (!audio && !video) {
      handleStopAudioVideoStream();
    }

    return () => {};
  }, [audio, handleStopAudioVideoStream, video]);

  return (
    <>
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
    </>
  );
}

export default AudioVideoButton;
