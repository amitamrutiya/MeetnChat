"use server";

import db from "@repo/db/client";

type GetGroupsPropsType = {
  user_id: string;
};

export const getGroups = async ({ user_id }: GetGroupsPropsType) => {
  if (!user_id) {
    return { success: false, message: "Invalid data" };
  }

  const groups = await db.group.findMany({
    where: {
      OR: [
        { creator_id: user_id }, // User is the creator of the group
        { members: { has: user_id } }, // Check if members list includes the creator_id
      ],
    },
 
  });

  if (!groups.length) {
    return { success: false, message: "No groups found" };
  }
  return { success: true, data: groups, message: "Groups found" };
};
