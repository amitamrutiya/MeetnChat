import { useContext } from "react";
import { Button } from "@/components/ui/button";
import { SettingsIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AudioVideoDevicesContext,
  AudioVideoDevicesProps,
} from "@/app/context/AudioVideoDevices";
import AudioVideoDeviceDropDown from "./AudioVideoDeviceDropDown";
import { MediaStreamContext, ProviderProps } from "@/app/context/MediaStream";
import { useStartUserStream } from "@/app/hooks/useStartStream";
import { useStopUserStream } from "@/app/hooks/useStopStream";

function SettingButton() {
  const {
    selectedAudioDevice,
    selectedVideoDevice,
  } = useContext(AudioVideoDevicesContext) as AudioVideoDevicesProps;

  const { userStream } = useContext(MediaStreamContext) as ProviderProps;
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
          <DialogDescription>
            Select the device you want to use for audio and video.
          </DialogDescription>
        </DialogHeader>
        <AudioVideoDeviceDropDown />
        <DialogFooter>
          <Button
            type="submit"
            onClick={() => {
              if (userStream) {
                handleStopAudioVideoStream();
                handleStartAudioVideoStream(
                  selectedAudioDevice,
                  selectedVideoDevice
                );
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
