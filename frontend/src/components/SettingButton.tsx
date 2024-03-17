import React, { useContext } from "react";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AudioVideoDevicesContext,
  AudioVideoDevicesProps,
} from "@/app/context/AudioVideoDevices";
import AudioVideoDeviceDropDown from "./AudioVideoDeviceDropDown";

function SettingButton() {
  const {
    audioDevices,
    videoDevices,
    selectedAudioDevice,
    selectedVideoDevice,
    setSelectedAudioDevice,
    setSelectedVideoDevice,
  } = useContext(AudioVideoDevicesContext) as AudioVideoDevicesProps;
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-foreground ml-5">
          <SettingsIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you are done.
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
