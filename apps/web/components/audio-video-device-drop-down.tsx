import {
  Button,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@repo/ui";
import { useRecoilState, useRecoilValue } from "recoil";
import { audioDevicesAtom, selectedAudioDeviceAtom, selectedVideoDeviceAtom, videoDevicesAtom } from "@repo/store";

function AudioVideoDeviceDropDown() {
  const audioDevices = useRecoilValue(audioDevicesAtom);
  const videoDevices = useRecoilValue(videoDevicesAtom);
  const [selectedAudioDevice, setSelectedAudioDevice] = useRecoilState(selectedAudioDeviceAtom);
  const [selectedVideoDevice, setSelectedVideoDevice] = useRecoilState(selectedVideoDeviceAtom);

  return (
    <div className="my-5 flex items-center justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="bg-foreground">Select Audio Devices</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Select Audio Devices</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={selectedAudioDevice} onValueChange={setSelectedAudioDevice}>
            {audioDevices.map((device) => (
              <DropdownMenuRadioItem key={device.deviceId} value={device.deviceId}>
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
          <DropdownMenuRadioGroup value={selectedVideoDevice} onValueChange={setSelectedVideoDevice}>
            {videoDevices.map((device) => (
              <DropdownMenuRadioItem key={device.deviceId} value={device.deviceId}>
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
