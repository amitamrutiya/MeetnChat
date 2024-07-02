import {atom} from "recoil";

export const userStreamAtom = atom<MediaStream | null>({
  key: "userStreamAtom",
  default: null,
});

export const remoteStreamsAtom = atom<MediaStream[]>({
  key: "remoteStreamsAtom",
  default: [],
});