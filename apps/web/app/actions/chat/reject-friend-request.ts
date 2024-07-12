"use server";

import db from "@repo/db/client";

type rejectFriendRequestType = {
  requestId: string;
};

export async function rejectFriendRequest({ requestId }: rejectFriendRequestType) {
  try {
    const friendRequest = await db.friendRequest.update({
      where: { id: requestId },
      data: {
        status: "rejected",
        updatedAt: new Date(),
      },
    });

    return { success: true, data: friendRequest, message: "Friend request rejected successfully" };
  } catch (error) {
    console.error("Error rejecting friend request", error);
    return { success: false, message: "Error rejecting friend request" };
  }
}
