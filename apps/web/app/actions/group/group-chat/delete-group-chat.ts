"use server";

import db from "@repo/db/client";

type DeleteGroupChatPropsType = {
  chat_id: string;
};

type DeleteAllGroupChatsPropsType = {
  group_id: string;
};

export const deleteGroupChat = async ({ chat_id }: DeleteGroupChatPropsType) => {
  if (!chat_id) {
    return { success: false, message: "Invalid data" };
  }

  const groupChat = await db.groupChat.delete({
    where: {
      id: chat_id,
    },
  });

  if (!groupChat) {
    return { success: false, message: "Group chat not deleted" };
  }

  return { success: true, data: groupChat, message: "Group chat deleted" };
};

export const deleteAllGroupChats = async ({ group_id }: DeleteAllGroupChatsPropsType) => {
  if (!group_id) {
    return { success: false, message: "Invalid data" };
  }

  const groupChat = await db.groupChat.deleteMany({
    where: {
      group_id,
    },
  });

  if (!groupChat) {
    return { success: false, message: "Group chat not deleted" };
  }

  return { success: true, data: groupChat, message: "Group chat deleted" };
};
