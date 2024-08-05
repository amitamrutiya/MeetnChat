"use server";

import db from "@repo/db/client";

type UpdateGroupPropsType = {
  user_id: string;
  group_id: string;
  name: string;
  description: string;
  image: string;
  limit: number;
  last_limit: number;
};

export const updateGroup = async ({
  group_id,
  name,
  description,
  image,
  limit,
  last_limit,
  user_id,
}: UpdateGroupPropsType) => {
  if (!group_id || !name || !description || !image || !limit || !last_limit || !user_id) {
    return { success: false, message: "Invalid data" };
  }

  if (limit < 1) {
    return { success: false, message: "Limit should be greater than 0" };
  } else if (limit > 50) {
    return { success: false, message: "Limit should be less than 50" };
  }

  const group = await db.group.findUnique({
    where: {
      id: group_id,
    },
  });

  if (!group) {
    return { success: false, message: "Group not found" };
  }

  if (group.creator_id !== user_id) {
    return { success: false, message: "You are not the creator of this group" };
  }

  const membersLength = group.members.length;
  if (limit < last_limit && membersLength > limit) {
    await db.group.update({
      where: {
        id: group_id,
      },
      data: {
        members: {
          set: [user_id],
        },
      },
    });
  }

  const newGroup = await db.group.update({
    where: {
      id: group_id,
      creator_id: user_id,
    },
    data: {
      name,
      description,
      image,
      limit,
      updatedAt: new Date(),
    },
  });

  if (!group) {
    return { success: false, message: "Group not updated" };
  }

  return { success: true, data: newGroup, message: "Group updated" };
};
