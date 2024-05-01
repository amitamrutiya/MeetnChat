"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const button_1 = require("@/components/ui/button");
const dropdown_menu_1 = require("@/components/ui/dropdown-menu");
const AudioVideoDevices_1 = require("@/app/context/AudioVideoDevices");
function AudioVideoDeviceDropDown() {
    const { audioDevices, videoDevices, selectedAudioDevice, selectedVideoDevice, setSelectedAudioDevice, setSelectedVideoDevice, } = (0, react_1.useContext)(AudioVideoDevices_1.AudioVideoDevicesContext);
    return (<div className="flex justify-center items-center my-5">
      <dropdown_menu_1.DropdownMenu>
        <dropdown_menu_1.DropdownMenuTrigger asChild>
          <button_1.Button className="bg-foreground">Select Audio Devices</button_1.Button>
        </dropdown_menu_1.DropdownMenuTrigger>
        <dropdown_menu_1.DropdownMenuContent>
          <dropdown_menu_1.DropdownMenuLabel>Select Audio Devices</dropdown_menu_1.DropdownMenuLabel>
          <dropdown_menu_1.DropdownMenuSeparator />
          <dropdown_menu_1.DropdownMenuRadioGroup value={selectedAudioDevice} onValueChange={setSelectedAudioDevice}>
            {audioDevices.map((device) => (<dropdown_menu_1.DropdownMenuRadioItem key={device.deviceId} value={device.deviceId}>
                {device.label}
              </dropdown_menu_1.DropdownMenuRadioItem>))}
          </dropdown_menu_1.DropdownMenuRadioGroup>
        </dropdown_menu_1.DropdownMenuContent>
      </dropdown_menu_1.DropdownMenu>

      <dropdown_menu_1.DropdownMenu>
        <dropdown_menu_1.DropdownMenuTrigger asChild>
          <button_1.Button className="bg-foreground ml-5">Select Video Devices</button_1.Button>
        </dropdown_menu_1.DropdownMenuTrigger>
        <dropdown_menu_1.DropdownMenuContent>
          <dropdown_menu_1.DropdownMenuLabel>Select Video Devices</dropdown_menu_1.DropdownMenuLabel>
          <dropdown_menu_1.DropdownMenuSeparator />
          <dropdown_menu_1.DropdownMenuRadioGroup value={selectedVideoDevice} onValueChange={setSelectedVideoDevice}>
            {videoDevices.map((device) => (<dropdown_menu_1.DropdownMenuRadioItem key={device.deviceId} value={device.deviceId}>
                {device.label}
              </dropdown_menu_1.DropdownMenuRadioItem>))}
          </dropdown_menu_1.DropdownMenuRadioGroup>
        </dropdown_menu_1.DropdownMenuContent>
      </dropdown_menu_1.DropdownMenu>
    </div>);
}
exports.default = AudioVideoDeviceDropDown;
