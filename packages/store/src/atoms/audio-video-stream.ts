import { atom } from "recoil";

export const isAudioStreamEnabledAtom = atom<boolean>({
  key: "isAudioStreamEnabledAtom",
  default: false,
});

export const isVideoStreamEnabledAtom = atom<boolean>({
  key: "isVideoStreamEnabledAtom",
  default: false,
});
