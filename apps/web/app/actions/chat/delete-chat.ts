"use server";
import db from "@repo/db/client";

type deleteChatType = {
  chat_id: string;
};

export async function deleteChat({ chat_id }: deleteChatType) {
  try {
    await db.chat.delete({
      where: {
        id: chat_id,
      },
    });
    return { success: true, message: "Chat deleted successfully" };
  } catch (error) {
    console.error("Error deleting chat", error);
    return { success: false, message: "Error deleting chat" };
  }
}
