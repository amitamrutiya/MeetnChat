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
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const lucide_react_1 = require("lucide-react");
const tooltip_1 = require("@/components/ui/tooltip");
const AudioVideoStream_1 = require("@/app/context/AudioVideoStream");
const MediaStream_1 = require("@/app/context/MediaStream");
const useStartStream_1 = require("@/app/hooks/useStartStream");
const useStopStream_1 = require("@/app/hooks/useStopStream");
const button_1 = require("./ui/button");
function AudioVideoButton() {
    const { audio, video, setAudio, setVideo } = react_1.default.useContext(AudioVideoStream_1.AudioVideoStreamContext);
    const { userStream } = (0, react_1.useContext)(MediaStream_1.MediaStreamContext);
    const { handleStartAudioVideoStream } = (0, useStartStream_1.useStartUserStream)();
    const { handleStopAudioVideoStream } = (0, useStopStream_1.useStopUserStream)();
    (0, react_1.useEffect)(() => {
        if (!audio && !video) {
            handleStopAudioVideoStream();
        }
        return () => { };
    }, [audio, handleStopAudioVideoStream, video]);
    return (<>
      <tooltip_1.TooltipProvider>
        <tooltip_1.Tooltip>
          <tooltip_1.TooltipTrigger>
            <button_1.Button size={"icon"} className={audio ? "bg-primary" : "bg-foreground"} onClick={() => {
            setAudio(!audio);
            if (!userStream) {
                handleStartAudioVideoStream();
                return;
            }
            const audioTrack = userStream === null || userStream === void 0 ? void 0 : userStream.getTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
            }
        }}>
              {audio ? <lucide_react_1.MicIcon /> : <lucide_react_1.MicOffIcon />}
            </button_1.Button>
          </tooltip_1.TooltipTrigger>
          <tooltip_1.TooltipContent>
            <p>{audio ? "Stop audio" : "Start audio"}</p>
          </tooltip_1.TooltipContent>
        </tooltip_1.Tooltip>
      </tooltip_1.TooltipProvider>
      <tooltip_1.TooltipProvider>
        <tooltip_1.Tooltip>
          <tooltip_1.TooltipTrigger>
            <button_1.Button size={"icon"} className={video ? "bg-primary" : "bg-foreground"} onClick={() => {
            if (!userStream) {
                setVideo(true);
                setAudio(true);
                handleStartAudioVideoStream();
                return;
            }
            setVideo(!video);
            const videoTrack = userStream === null || userStream === void 0 ? void 0 : userStream.getTracks()[1];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
            }
        }}>
              {video ? <lucide_react_1.VideoIcon /> : <lucide_react_1.VideoOffIcon />}
            </button_1.Button>
          </tooltip_1.TooltipTrigger>
          <tooltip_1.TooltipContent>
            <p>{video ? "Stop video" : "Start video"}</p>
          </tooltip_1.TooltipContent>
        </tooltip_1.Tooltip>
      </tooltip_1.TooltipProvider>
    </>);
}
exports.default = AudioVideoButton;
