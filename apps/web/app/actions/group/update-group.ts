"use server";

import db from "@repo/db/client";

type UpdateGroupPropsType = {
  group_id: string;
  name: string;
  description: string;
  image: string;
  limit: number;
  last_limit: number;
};

export const updateGroup = async ({ group_id, name, description, image, limit, last_limit }: UpdateGroupPropsType) => {
  if (!group_id || !name || !description || !image || !limit) {
    return { success: false, message: "Invalid data" };
  }

  if (limit < 1) {
    return { success: false, message: "Limit should be greater than 0" };
  } else if (limit > 50) {
    return { success: false, message: "Limit should be less than 50" };
  }

  if (limit < last_limit) {
    await db.group.update({
      where: {
        id: group_id,
      },
      data: {
        members: {
          set: [],
        },
      },
    });
  }

  const group = await db.group.update({
    where: {
      id: group_id,
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

  return { success: true, data: group, message: "Group updated" };
};
