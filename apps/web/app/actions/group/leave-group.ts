"use server";

import db from "@repo/db/client";
import { deleteGroup } from "./delete-group";

type leaveGroupPropsType = {
  group_id: string;
  user_id: string;
};

export const leaveGroup = async ({ group_id, user_id }: leaveGroupPropsType) => {
  if (!group_id || !user_id) {
    return { success: false, message: "Invalid data" };
  }

  const group = await db.group.findUnique({
    where: {
      id: group_id,
    },
    select: {
      members: true,
      creator_id: true,
    },
  });

  if (!group) {
    return { success: false, message: "Group not found" };
  }

  if (!group.members.includes(user_id)) {
    return { success: false, message: "User not in group" };
  }

  if (group.members.length === 0) {
    return { success: false, message: "Group has no members" };
  }

  if (group.creator_id === user_id) {
    return { success: false, message: "Group creator cannot leave group" };
  }

  if (group.members.length === 1) {
    const response = await deleteGroup({ group_id });
    if (!response.success) {
      return { success: false, message: "Group not deleted" };
    }

    return { success: true, message: "Group deleted" };
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
    return { success: false, message: "Group not updated" };
  }

  return { success: true, data: updatedGroup, message: "You  leave from the group" };
};
