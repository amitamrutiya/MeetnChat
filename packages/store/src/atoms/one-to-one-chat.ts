import { User } from "@prisma/client";
import { atom } from "recoil";

export const selectedTabState = atom<string | null>({
  key: "selectedTabState", // unique ID (with respect to other atoms/selectors)
  default: null, // default value (aka initial value)
});

export const contactsState = atom<User[]>({
  key: "contactsState",
  default: [],
});

export const frequentChatUsersState = atom<User[]>({
  key: "frequentChatUsersState",
  default: [],
});

export const loadingState = atom<boolean>({
  key: "loadingState",
  default: false,
});

export const requestUserDataState = atom<Map<string, User> | undefined>({
  key: "requestUserDataState",
  default: undefined,
});

export const inviteUserDataState = atom<Map<string, User> | undefined>({
  key: "inviteUserDataState",
  default: undefined,
});

export const pageNumberState = atom<number>({
  key: "pageNumberState",
  default: 1,
});
