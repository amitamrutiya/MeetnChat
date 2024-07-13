"use server";

import { User } from "@prisma/client";
import db from "@repo/db/client";
import { getUserById } from "../user/get-user";

type getChatsType = {
  user_id: string;
};

export async function getFrequentChatUsers({ user_id }: getChatsType): Promise<User[]> {
  try {
    let frequentChatUsersId: string[] = [];
    const chats = await db.chat.findMany({
      where: {
        OR: [{ sender_id: user_id }, { receiver_id: user_id }],
      },
    });
    chats.forEach((chat) => {
      const userIdToAdd = chat.sender_id !== user_id ? chat.sender_id : chat.receiver_id;
      if (!frequentChatUsersId.includes(userIdToAdd)) {
        frequentChatUsersId.push(userIdToAdd);
      }
    });
    frequentChatUsersId = frequentChatUsersId.filter((value, index, self) => self.indexOf(value) === index);
    const usersPromises = frequentChatUsersId.map((user_id) => getUserById({ user_id }));
    const users = await Promise.all(usersPromises);
    console.log(
      "chat users",
      users.filter((user) => user !== null)
    );
    return users.filter((user) => user !== null);
  } catch (error) {
    console.error("Error getting chats", error);
    return [];
  }
}
