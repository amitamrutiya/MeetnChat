import { atom } from "recoil";

export const audioDevicesAtom = atom<MediaDeviceInfo[]>({
  key: "audioDevicesAtom",
  default: [],
});

export const videoDevicesAtom = atom<MediaDeviceInfo[]>({
  key: "videoDevicesAtom",
  default: [],
});

export const selectedAudioDeviceAtom = atom<string>({
  key: "selectedAudioDeviceAtom",
  default: "",
});

export const selectedVideoDeviceAtom = atom<string>({
  key: "selectedVideoDeviceAtom",
  default: "",
});
