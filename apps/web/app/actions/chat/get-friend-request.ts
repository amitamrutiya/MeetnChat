"use server";

import db from "@repo/db/client";

type getFriendRequestType = {
  requestId: string;
};

export async function getFriendRequest({ requestId }: getFriendRequestType) {
  try {
    const friendRequest = await db.friendRequest.findUnique({
      where: { id: requestId },
    });

    return { success: true, data: friendRequest, message: "Friend request found successfully" };
  } catch (error) {
    console.error("Error finding friend request", error);
    return { success: false, message: "Error finding friend request" };
  }
}

export async function getReceivedFriendRequests({ userId }: { userId: string }) {
  try {
    const friendRequests = await db.friendRequest.findMany({
      where: { receiver_id: userId },
    });

    return { success: true, data: friendRequests, message: "Friend requests found successfully" };
  } catch (error) {
    console.error("Error finding friend requests", error);
    return { success: false, message: "Error finding friend requests" };
  }
}

export async function getSentFriendRequests({ userId }: { userId: string }) {
  try {
    const friendRequests = await db.friendRequest.findMany({
      where: { sender_id: userId },
    });

    return { success: true, data: friendRequests, message: "Sent friend requests found successfully" };
  } catch (error) {
    console.error("Error finding sent friend requests", error);
    return { success: false, message: "Error finding sent friend requests" };
  }
}
