"use server";

import db from "@repo/db/client";

type getChatsType = {
  sender_id: string;
  receiver_id: string;
};

export async function getExistingChats({ sender_id, receiver_id }: getChatsType) {
  try {
    const chats = await db.chat.findMany({
      where: {
        OR: [
          { sender_id, receiver_id },
          { sender_id: receiver_id, receiver_id: sender_id },
        ],
      },
    });
    return { success: true, data: chats };
  } catch (error) {
    console.error("Error getting chats", error);
    return { success: false, message: "Failed to get chats" };
  }
}
