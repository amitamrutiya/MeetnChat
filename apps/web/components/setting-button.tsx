import { SettingsIcon } from "lucide-react";
import AudioVideoDeviceDropDown from "./audio-video-device-drop-down";
import {
  Button,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@repo/ui";
import { useStartUserStream } from "../hooks/use-start-stream";
import { useStopUserStream } from "../hooks/use-stop-stream";
import { useRecoilValue } from "recoil";
import { selectedAudioDeviceAtom, selectedVideoDeviceAtom, userStreamAtom } from "@repo/store";

function SettingButton() {
  const selectedAudioDevice = useRecoilValue(selectedAudioDeviceAtom);
  const selectedVideoDevice = useRecoilValue(selectedVideoDeviceAtom);
  const userStream = useRecoilValue(userStreamAtom);
  const { handleStartAudioVideoStream } = useStartUserStream();
  const { handleStopAudioVideoStream } = useStopUserStream();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={"icon"} className="bg-foreground">
          <SettingsIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Choose Your Device</DialogTitle>
          <DialogDescription>Select the device you want to use for audio and video.</DialogDescription>
        </DialogHeader>
        <AudioVideoDeviceDropDown />
        <DialogFooter>
          <Button
            type="submit"
            onClick={() => {
              if (userStream) {
                handleStopAudioVideoStream();
                handleStartAudioVideoStream(selectedAudioDevice, selectedVideoDevice);
              }
            }}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default SettingButton;
