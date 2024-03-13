import React from "react";
import { LucideScreenShare, LucideScreenShareOff } from "lucide-react";
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

export interface ScreenShareProps {
  onStartScreenShare?: () => void;
  onStopScreenShare?: () => void;
}

const ScreenShare: React.FC<ScreenShareProps> = (props) => {
  const { onStartScreenShare, onStopScreenShare } = props;
  //   const [screenStream, setScreenStream] = useState<MediaStream | null>(null)
  const { userScreenStream, remoteScreenStream } = React.useContext(
    MediaScreenStreamContext
  ) as ProviderScreenProps;

  return (
    <div>
      <div className="h-[5vh] w-full  rounded-lg bg-slate-600">
        <div
          className="flex h-full w-full items-center justify-evenly"
          id="tools-container"
        >
          {userScreenStream ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div>
                    <LucideScreenShare
                      className="cursor-pointer"
                      onClick={onStopScreenShare}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Stop screen share</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div>
                    <LucideScreenShareOff
                      className="cursor-pointer"
                      onClick={onStartScreenShare}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Start screen share</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScreenShare;
