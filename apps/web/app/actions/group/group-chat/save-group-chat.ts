"use server";

import db from "@repo/db/client";

type SaveGroupChatPropsType = {
  group_id: string;
  sender_id: string;
  message: string;
};

export const saveGroupChat = async ({ group_id, sender_id, message }: SaveGroupChatPropsType) => {
  if (!group_id || !sender_id || !message) {
    return { success: false, message: "Invalid data" };
  }

  const groupChat = await db.groupChat.create({
    data: {
      group_id,
      sender_id,
      message,
    },
  });

  if (!groupChat) {
    return { success: false, message: "Group chat not saved" };
  }

  return { success: true, data: groupChat, message: "Group chat saved" };
};
