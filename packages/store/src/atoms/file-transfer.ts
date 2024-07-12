import { atom } from "recoil";
import { AvailableFiles } from "@repo/common";

export const availableFilesAtom = atom<AvailableFiles[]>({
  key: "availableFilesAtom",
  default: [],
});
