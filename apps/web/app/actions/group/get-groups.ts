"use server";

import db from "@repo/db/client";

type GetGroupsPropsType = {
  creator_id: string;
};

export const getGroups = async ({ creator_id }: GetGroupsPropsType) => {
  if (!creator_id) {
    return { success: false, message: "Invalid data" };
  }

  const groups = await db.group.findMany({
    where: {
      creator_id,
    },
  });

  if (!groups) {
    return { success: false, message: "No groups found" };
  }
  return { success: true, data: groups, message: "Groups found" };
};
