"use server";

import db from "@repo/db/client";

type GetGroupChatsPropsTypes = {
  group_id: string;
};

export default async function getGroupChats({ group_id }: GetGroupChatsPropsTypes) {
  if (!group_id) {
    return { success: false, message: "Invalid data" };
  }

  const groupChats = await db.groupChat.findMany({
    where: {
      id: group_id,
    },
  });

  if (!groupChats) {
    return { success: false, message: "Group chats not found" };
  }

  return { success: true, data: groupChats, message: "Group chats fetched" };
}
