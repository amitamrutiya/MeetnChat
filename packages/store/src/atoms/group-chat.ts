import { atom } from "recoil";
import { Group, User, GroupChat } from "@prisma/client";

type Member = {
  id: number;
  name: string;
  image: string;
};

export const selectGroupAtom = atom<Group | null>({
  key: "selectGroupAtom",
  default: null,
});

export const selectedGroupInviteUsersAtom = atom<Group | null>({
  key: "selectedGroupInviteUsersAtom",
  default: null,
});

export const inviteUserListAtom = atom<User[]>({
  key: "inviteUserList",
  default: [],
});

export const loadingAtom = atom<boolean>({
  key: "loading",
  default: false,
});

export const chatLoadingAtom = atom<boolean>({
  key: "chatLoading",
  default: false,
});

export const selectedAtom = atom<User[]>({
  key: "selected",
  default: [],
});

export const isOpenAtom = atom<{
  addMembers: boolean;
  editGroup: boolean;
  createGroup: boolean;
  clearChat: boolean;
  deleteGroup: boolean;
}>({
  key: "isOpen",
  default: {
    addMembers: false,
    editGroup: false,
    createGroup: false,
    clearChat: false,
    deleteGroup: false,
  },
});

export const groupMembersAtom = atom<User[]>({
  key: "groupMembers",
  default: [],
});

export const groupChatAtom = atom<GroupChat[]>({
  key: "groupChat",
  default: [],
});

export const groupsAtom = atom<Group[]>({
  key: "groups",
  default: [],
});
