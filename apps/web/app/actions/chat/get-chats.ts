"use server";

import db from "@repo/db/client";

type getChatsType = {
  user_id: string;
};

export async function getChats({ user_id }: getChatsType) {
  try {
    const chats = await db.chat.findMany({
      where: {
        OR: [{ sender_id: user_id }, { receiver_id: user_id }],
      },
    });
    return chats;
  } catch (error) {
    console.error("Error getting chats", error);
    return null;
  }
}
