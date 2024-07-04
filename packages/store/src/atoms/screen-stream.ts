import { atom } from "recoil";

export const userScreenStreamAtom = atom<MediaStream | null>({
  key: "userScreenStreamAtom",
  default: null,
});

export const remoteScreenStreamsAtom = atom<MediaStream[]>({
  key: "remoteScreenStreamsAtom",
  default: [],
});
