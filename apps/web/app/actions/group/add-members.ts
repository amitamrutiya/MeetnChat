"use server";

import db from "@repo/db/client";
import { Group } from "@prisma/client";

type AddMembersPropsType = {
  group_id: string;
  members: string[];
};

export const addMembers = async ({ group_id, members }: AddMembersPropsType) => {
  if (!group_id || members.length === 0) {
    return { success: false, message: "Invalid data" };
  }

  const group: Group | null = await db.group.findUnique({
    where: {
      id: group_id,
    },
  });

  if (!group) {
    return { success: false, message: "Group not found" };
  }

  if (group.members.length + members.length > group.limit) {
    return { success: false, message: "Members limit exceeded" };
  }

  const existingMembers = group.members.filter((member) => members.includes(member));

  if (existingMembers.length > 0) {
    return { success: false, message: "One of the Members already present in group" };
  }

  const updatedGroup = await db.group.update({
    where: {
      id: group_id,
    },
    data: {
      members: {
        set: [...group.members, ...members],
      },
    },
  });

  if (!updatedGroup) {
    return { success: false, message: "Members not added" };
  }

  return { success: true, data: updatedGroup, message: "Members added" };
};
