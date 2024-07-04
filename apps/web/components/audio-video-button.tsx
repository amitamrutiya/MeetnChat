import React, { useEffect } from "react";
import { MicIcon, MicOffIcon, VideoIcon, VideoOffIcon } from "lucide-react";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  Button,
} from "@repo/ui";
import { useStartUserStream } from "../hooks/use-start-stream";
import { useStopUserStream } from "../hooks/use-stop-stream";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  isAudioStreamEnabledAtom,
  userStreamAtom,
  isVideoStreamEnabledAtom,
} from "@repo/store";

function AudioVideoButton() {
  const [audio, setAudio] = useRecoilState(isAudioStreamEnabledAtom);
  const [video, setVideo] = useRecoilState(isVideoStreamEnabledAtom);

  const userStream = useRecoilValue(userStreamAtom);
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
