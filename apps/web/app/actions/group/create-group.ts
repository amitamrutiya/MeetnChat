"use server";

import db from "@repo/db/client";

type createGroupPropsType = {
  creator_id: string;
  name: string;
  description: string;
  image: string;
  limit: number;
  members: string[];
};

export const createGroup = async ({ creator_id, name, description, image, limit, members }: createGroupPropsType) => {
  if (!creator_id || !name || !description || !image || !limit) {
    return { success: false, message: "Invalid data" };
  }

  const group = await db.group.create({
    data: {
      creator_id,
      name,
      description,
      image,
      limit,
      createdAt: new Date(),
      members: [creator_id, ...members],
      updatedAt: new Date(),
    },
  });

  if (!group) {
    return { success: false, message: "Group not created" };
  }

  return { success: true, data: group, message: "Group created" };
};
