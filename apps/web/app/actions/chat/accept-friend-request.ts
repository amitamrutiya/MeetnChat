"use server";

import db from "@repo/db/client";

type acceptFriendRequestType = {
  requestId: string;
};

export async function acceptFriendRequest({ requestId }: acceptFriendRequestType) {
  try {
    const friendRequest = await db.friendRequest.update({
      where: { id: requestId },
      data: {
        status: "accepted",
        updatedAt: new Date(),
      },
    });

    const sender = friendRequest.sender_id;
    const receiver = friendRequest.receiver_id;

    await db.user.update({
      where: { id: sender },
      data: {
        friends: {
          push: receiver,
        },
      },
    });

    await db.user.update({
      where: { id: receiver },
      data: {
        friends: {
          push: sender,
        },
      },
    });

    return { success: true, data: friendRequest, message: "Friend request accepted successfully" };
  } catch (error) {
    console.error("Error accepting friend request", error);
    return { success: false, message: "Error accepting friend request" };
  }
}
