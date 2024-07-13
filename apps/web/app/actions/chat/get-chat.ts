"use server";

import db from "@repo/db/client";

type getChatType = {
  chatId: string;
};

export async function getChat({ chatId }: getChatType) {
  try {
    const chat = await db.chat.findUnique({
      where: {
        id: chatId,
      },
    });
    return chat;
  } catch (error) {
    console.error("Error getting chat", error);
    return null;
  }
}
