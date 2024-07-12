import React, { useState } from "react";
import { LucideScreenShare, LucideScreenShareOff, CircleIcon, PresentationIcon } from "lucide-react";

import EndMeetButton from "./end-meet-button";
import SettingButton from "./setting-button";
import ChatButton from "./chat-button";
import AudioVideoButton from "./audio-video-button";
import { Button, TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@repo/ui";
import { useStartUserStream } from "../hooks/use-start-stream";
import { useStopUserStream } from "../hooks/use-stop-stream";
import { useRecoilValue } from "recoil";
import { userScreenStreamAtom } from "@repo/store";

const MeetControllerBar = (props: { remoteSocketId: string }) => {
  const { remoteSocketId } = props;
  const userScreenStream = useRecoilValue(userScreenStreamAtom);
  const [whiteboard, setWhiteboard] = useState<boolean>(true);
  const { handleStartScreenShareStream } = useStartUserStream();
  const { handleStopScreenShareStream } = useStopUserStream();

  return (
    <div className="flex flex-row">
      <div className="mx-auto rounded-lg bg-slate-600 px-3 py-2 sm:w-auto">
        <div className="flex h-full w-full flex-row items-center justify-center gap-4" id="tools-container">
          {/* Audio Video Button */}
          <AudioVideoButton />

          {/* Screen Share Button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  size={"icon"}
                  className={userScreenStream ? "bg-primary" : "bg-foreground"}
                  onClick={userScreenStream ? handleStopScreenShareStream : handleStartScreenShareStream}
                >
                  {userScreenStream ? <LucideScreenShare /> : <LucideScreenShareOff />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{userScreenStream ? "Stop screen share" : "Start screen share"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Chat Button */}
          <ChatButton remoteSocketId={remoteSocketId} />

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
