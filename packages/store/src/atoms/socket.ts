import { atom } from "recoil";
import { Socket } from "socket.io-client";

export const socketStateAtom = atom<Socket | null>({
  key: "socketStateAtom",
  default: null,
});
