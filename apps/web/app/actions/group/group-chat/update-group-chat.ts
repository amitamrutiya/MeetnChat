"use server";

import db from "@repo/db/client";

type UpdateGroupChatPropsType = {
  chat_id: string;
  message: string;
};

export const updateGroupChat = async ({ chat_id, message }: UpdateGroupChatPropsType) => {
  if (!chat_id || !message) {
    return { success: false, message: "Invalid data" };
  }

  const groupChat = await db.groupChat.update({
    where: {
      id: chat_id,
    },
    data: {
      message,
      updatedAt: new Date(),
    },
  });

  if (!groupChat) {
    return { success: false, message: "Group chat not updated" };
  }

  return { success: true, data: groupChat, message: "Group chat updated" };
};
