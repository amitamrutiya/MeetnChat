"use server";

import { db } from "@/lib/db";

type updateChatProps = {
  chatId: string;
  message: string;
};

export async function updateChat({ chatId, message }: updateChatProps) {
  try {
    await db.chat.update({
      where: {
        id: chatId,
      },
      data: {
        message,
      },
    });
    return { success: true, message: "Chat updated successfully" };
  } catch (error) {
    console.error("Error updating chat", error);
    return { success: false, message: "Error updating chat" };
  }
}
