"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const button_1 = require("@/components/ui/button");
const lucide_react_1 = require("lucide-react");
const dialog_1 = require("@/components/ui/dialog");
const AudioVideoDevices_1 = require("@/app/context/AudioVideoDevices");
const AudioVideoDeviceDropDown_1 = __importDefault(require("./AudioVideoDeviceDropDown"));
const MediaStream_1 = require("@/app/context/MediaStream");
const useStartStream_1 = require("@/app/hooks/useStartStream");
const useStopStream_1 = require("@/app/hooks/useStopStream");
function SettingButton() {
    const { selectedAudioDevice, selectedVideoDevice, } = (0, react_1.useContext)(AudioVideoDevices_1.AudioVideoDevicesContext);
    const { userStream } = (0, react_1.useContext)(MediaStream_1.MediaStreamContext);
    const { handleStartAudioVideoStream } = (0, useStartStream_1.useStartUserStream)();
    const { handleStopAudioVideoStream } = (0, useStopStream_1.useStopUserStream)();
    return (<dialog_1.Dialog>
      <dialog_1.DialogTrigger asChild>
        <button_1.Button size={"icon"} className="bg-foreground">
          <lucide_react_1.SettingsIcon />
        </button_1.Button>
      </dialog_1.DialogTrigger>
      <dialog_1.DialogContent className="sm:max-w-[425px]">
        <dialog_1.DialogHeader>
          <dialog_1.DialogTitle>Choose Your Device</dialog_1.DialogTitle>
          <dialog_1.DialogDescription>
            Select the device you want to use for audio and video.
          </dialog_1.DialogDescription>
        </dialog_1.DialogHeader>
        <AudioVideoDeviceDropDown_1.default />
        <dialog_1.DialogFooter>
          <button_1.Button type="submit" onClick={() => {
            if (userStream) {
                handleStopAudioVideoStream();
                handleStartAudioVideoStream(selectedAudioDevice, selectedVideoDevice);
            }
        }}>
            Save changes
          </button_1.Button>
        </dialog_1.DialogFooter>
      </dialog_1.DialogContent>
    </dialog_1.Dialog>);
}
exports.default = SettingButton;
