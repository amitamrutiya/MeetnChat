"use server";
import db from "@repo/db/client";

type deleteChatType = {
  chatId: string;
};

export async function deleteChat({ chatId }: deleteChatType) {
  try {
    await db.chat.delete({
      where: {
        id: chatId,
      },
    });
    return { success: true, message: "Chat deleted successfully" };
  } catch (error) {
    console.error("Error deleting chat", error);
    return { success: false, message: "Error deleting chat" };
  }
}
