"use server";

import db from "@repo/db/client";

type saveChatType = {
  message: string;
  sender_id: string;
  receiver_id: string;
};

export async function saveChat({
  message,
  sender_id,
  receiver_id,
}: saveChatType) {
  try {
    await db.chat.create({
      data: {
        message,
        sender_id,
        receiver_id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return { success: true, message: "Chat saved successfully" };
  } catch (error) {
    console.error("Error saving chat", error);
    return { success: false, message: "Error saving chat" };
  }
}
