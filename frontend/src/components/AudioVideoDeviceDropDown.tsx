import { useContext } from "react";
import { Button } from "@/components/ui/button";
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

function AudioVideoDeviceDropDown() {
  const {
    audioDevices,
    videoDevices,
    selectedAudioDevice,
    selectedVideoDevice,
    setSelectedAudioDevice,
    setSelectedVideoDevice,
  } = useContext(AudioVideoDevicesContext) as AudioVideoDevicesProps;

  return (
    <div className="flex justify-center items-center my-5">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="bg-foreground">Select Audio Devices</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Select Audio Devices</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={selectedAudioDevice}
            onValueChange={setSelectedAudioDevice}
          >
            {audioDevices.map((device) => (
              <DropdownMenuRadioItem
                key={device.deviceId}
                value={device.deviceId}
              >
                {device.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="bg-foreground ml-5">Select Video Devices</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Select Video Devices</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={selectedVideoDevice}
            onValueChange={setSelectedVideoDevice}
          >
            {videoDevices.map((device) => (
              <DropdownMenuRadioItem
                key={device.deviceId}
                value={device.deviceId}
              >
                {device.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default AudioVideoDeviceDropDown;
