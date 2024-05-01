"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const lucide_react_1 = require("lucide-react");
const ScreenStream_1 = require("@/app/context/ScreenStream");
const tooltip_1 = require("@/components/ui/tooltip");
const button_1 = require("./ui/button");
const EndMeetButton_1 = __importDefault(require("./EndMeetButton"));
const SettingButton_1 = __importDefault(require("./SettingButton"));
const useStartStream_1 = require("@/app/hooks/useStartStream");
const useStopStream_1 = require("@/app/hooks/useStopStream");
const ChatButton_1 = __importDefault(require("./ChatButton"));
const AudioVideoButton_1 = __importDefault(require("./AudioVideoButton"));
const MeetControllerBar = (props) => {
    const { remoteSocketId } = props;
    const { userScreenStream } = react_1.default.useContext(ScreenStream_1.MediaScreenStreamContext);
    const [whiteboard, setWhiteboard] = (0, react_1.useState)(true);
    const { handleStartScreenShareStream } = (0, useStartStream_1.useStartUserStream)();
    const { handleStopScreenShareStream } = (0, useStopStream_1.useStopUserStream)();
    return (<div className="flex flex-row ">
      <div className="sm:w-auto rounded-lg bg-slate-600 px-3 mx-auto py-2">
        <div className="flex flex-row h-full w-full items-center justify-center gap-4" id="tools-container">
          {/* Audio Video Button */}
          <AudioVideoButton_1.default />

          {/* Screen Share Button */}
          <tooltip_1.TooltipProvider>
            <tooltip_1.Tooltip>
              <tooltip_1.TooltipTrigger>
                <button_1.Button size={"icon"} className={userScreenStream ? "bg-primary" : "bg-foreground"} onClick={userScreenStream
            ? handleStopScreenShareStream
            : handleStartScreenShareStream}>
                  {userScreenStream ? (<lucide_react_1.LucideScreenShare />) : (<lucide_react_1.LucideScreenShareOff />)}
                </button_1.Button>
              </tooltip_1.TooltipTrigger>
              <tooltip_1.TooltipContent>
                <p>
                  {userScreenStream
            ? "Stop screen share"
            : "Start screen share"}
                </p>
              </tooltip_1.TooltipContent>
            </tooltip_1.Tooltip>
          </tooltip_1.TooltipProvider>

          {/* Chat Button */}
          <ChatButton_1.default remoteSocketId={remoteSocketId}/>

          {/* recording button */}
          <tooltip_1.TooltipProvider>
            <tooltip_1.Tooltip>
              <tooltip_1.TooltipTrigger>
                <button_1.Button size={"icon"} className="bg-foreground">
                  <lucide_react_1.CircleIcon />
                </button_1.Button>
              </tooltip_1.TooltipTrigger>
              <tooltip_1.TooltipContent>
                <p>Start Record</p>
              </tooltip_1.TooltipContent>
            </tooltip_1.Tooltip>
          </tooltip_1.TooltipProvider>

          {/* whiteboard button */}
          <tooltip_1.TooltipProvider>
            <tooltip_1.Tooltip>
              <tooltip_1.TooltipTrigger>
                <button_1.Button size={"icon"} className={whiteboard ? "bg-primary" : "bg-foreground"} onClick={() => setWhiteboard(!whiteboard)}>
                  <lucide_react_1.PresentationIcon />
                </button_1.Button>
              </tooltip_1.TooltipTrigger>
              <tooltip_1.TooltipContent>
                <p>Whiteboard</p>
              </tooltip_1.TooltipContent>
            </tooltip_1.Tooltip>
          </tooltip_1.TooltipProvider>

          {/* Setting Button */}
          <SettingButton_1.default />

          {/* End Call Button */}
          <EndMeetButton_1.default />
        </div>
      </div>
    </div>);
};
exports.default = MeetControllerBar;
