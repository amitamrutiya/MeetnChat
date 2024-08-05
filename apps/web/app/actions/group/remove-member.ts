"use server";

import db from "@repo/db/client";

type RemoveMemberFromGroupPropsType = {
  group_id: string;
  user_id: string;
  current_user_id: string;
};

export const removeMemeberFromGroup = async ({
  group_id,
  user_id,
  current_user_id,
}: RemoveMemberFromGroupPropsType) => {
  if (!group_id || !user_id) {
    return { success: false, message: "Invalid data" };
  }

  const group = await db.group.findUnique({
    where: {
      id: group_id,
    },
    select: {
      creator_id: true,
      members: true,
    },
  });

  if (!group) {
    return { success: false, message: "Group not found" };
  }

  if (group.creator_id !== current_user_id) {
    return { success: false, message: "Only the group creator can remove the group" };
  }
  const updatedMembers = group.members.filter((memberId) => memberId !== user_id);

  const updatedGroup = await db.group.update({
    where: {
      id: group_id,
    },
    data: {
      members: updatedMembers,
    },
  });

  if (!updatedGroup) {
    return { success: false, message: "User not removed" };
  }

  return { success: true, data: updatedGroup, message: "User remove succesfully" };
};
