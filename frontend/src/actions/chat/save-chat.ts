"use server";

import { db } from "@/lib/db";
import { Chat } from "@prisma/client";

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
    const chat: Chat = await db.chat.create({
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
