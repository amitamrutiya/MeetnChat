import { atom } from "recoil";
import { User } from "@prisma/client";

export const selectChatAtom = atom<User | null>({
  key: "selectChatAtom",
  default: null,
});
