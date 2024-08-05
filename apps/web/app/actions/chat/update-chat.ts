"use server";

import db from "@repo/db/client";

type updateChatProps = {
  chat_id: string;
  message: string;
};

export async function updateChat({ chat_id, message }: updateChatProps) {
  try {
    const chat = await db.chat.update({
      where: {
        id: chat_id,
      },
      data: {
        message,
        updatedAt: new Date(),
      },
    });
    return { success: true, data: chat, message: "Chat updated successfully" };
  } catch (error) {
    console.error("Error updating chat", error);
    return { success: false, message: "Error updating chat" };
  }
}
