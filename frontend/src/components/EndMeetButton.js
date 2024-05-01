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
const lucide_react_1 = require("lucide-react");
const react_1 = __importStar(require("react"));
const ScreenStream_1 = require("@/app/context/ScreenStream");
const tooltip_1 = require("@/components/ui/tooltip");
const MediaStream_1 = require("@/app/context/MediaStream");
const button_1 = require("./ui/button");
const SocketContext_1 = require("@/app/context/SocketContext");
const navigation_1 = require("next/navigation");
const alert_dialog_1 = require("@/components/ui/alert-dialog");
const useStopStream_1 = require("@/app/hooks/useStopStream");
function EndMeetButton() {
    const { handleStopAudioVideoStream, handleStopScreenShareStream } = (0, useStopStream_1.useStopUserStream)();
    const { userStream } = (0, react_1.useContext)(MediaStream_1.MediaStreamContext);
    const { userScreenStream } = react_1.default.useContext(ScreenStream_1.MediaScreenStreamContext);
    const socket = react_1.default.useContext(SocketContext_1.SocketContext);
    const router = (0, navigation_1.useRouter)();
    return (<div>
      {" "}
      <tooltip_1.TooltipProvider>
        <tooltip_1.Tooltip>
          <tooltip_1.TooltipTrigger>
            <alert_dialog_1.AlertDialog>
              <alert_dialog_1.AlertDialogTrigger>
                <button_1.Button size={"icon"} variant={"destructive"}>
                  <lucide_react_1.PhoneOffIcon />
                </button_1.Button>
              </alert_dialog_1.AlertDialogTrigger>
              <alert_dialog_1.AlertDialogContent>
                <alert_dialog_1.AlertDialogHeader>
                  <alert_dialog_1.AlertDialogTitle>
                    Are you sure you want to end the call?
                  </alert_dialog_1.AlertDialogTitle>
                  <alert_dialog_1.AlertDialogDescription>
                    You will be disconnected from the call.
                  </alert_dialog_1.AlertDialogDescription>
                </alert_dialog_1.AlertDialogHeader>
                <alert_dialog_1.AlertDialogFooter>
                  <alert_dialog_1.AlertDialogCancel onClick={() => { }}>
                    Cancle
                  </alert_dialog_1.AlertDialogCancel>
                  <alert_dialog_1.AlertDialogAction className="bg-destructive text-destructive-foreground" onClick={() => {
            if (userStream) {
                handleStopAudioVideoStream();
            }
            if (userScreenStream) {
                handleStopScreenShareStream();
            }
            socket.emit("user-disconnect");
            router.push("/");
        }}>
                    End Call
                  </alert_dialog_1.AlertDialogAction>
                </alert_dialog_1.AlertDialogFooter>
              </alert_dialog_1.AlertDialogContent>
            </alert_dialog_1.AlertDialog>
          </tooltip_1.TooltipTrigger>
          <tooltip_1.TooltipContent className="bg-destructive text-foreground">
            <p>End Call</p>
          </tooltip_1.TooltipContent>
        </tooltip_1.Tooltip>
      </tooltip_1.TooltipProvider>
    </div>);
}
exports.default = EndMeetButton;
