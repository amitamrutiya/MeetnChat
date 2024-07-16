"use server";

import db from "@repo/db/client";

type joinGroupPropsType = {
  group_id: string;
  user_id: string;
};

export const joinGroup = async ({ group_id, user_id }: joinGroupPropsType) => {
  if (!group_id || !user_id) {
    return { success: false, message: "Invalid data" };
  }

  const group = await db.group.findUnique({
    where: {
      id: group_id,
    },
  });

  if (!group) {
    return { success: false, message: "Group not found" };
  }

  if (group.members.includes(user_id)) {
    return { success: false, message: "User already present in group" };
  }

  if (group.members.length >= group.limit) {
    return { success: false, message: "Members limit exceeded" };
  }

  const updatedGroup = await db.group.update({
    where: {
      id: group_id,
    },
    data: {
      members: {
        set: [...group.members, user_id],
      },
    },
  });

  if (!updatedGroup) {
    return { success: false, message: "Failed to Add User" };
  }

  return { success: true, data: updatedGroup, message: "Congratulation, you have Joined the Group Successfully!" };
};
