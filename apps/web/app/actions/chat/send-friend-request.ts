"use server";

import db from "@repo/db/client";

type sendFriendRequestType = {
  userId: string;
  friendId: string;
};

export async function sendFriendRequest({ userId, friendId }: sendFriendRequestType) {
  try {
    const newFriendRequest = await db.friendRequest.create({
      data: {
        sender_id: userId,
        receiver_id: friendId,
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return { success: true, data: newFriendRequest, message: "Friend request sent successfully" };
  } catch (error) {
    console.error("Error sending friend request", error);
    return { success: false, message: "Error sending friend request" };
  }
}
