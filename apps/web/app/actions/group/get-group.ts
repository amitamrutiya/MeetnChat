"use server";

import db from "@repo/db/client";

export const getGroup = async ({ group_id }: { group_id: string }) => {
  if (!group_id) {
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

  return { success: true, data: group, message: "Group found" };
};
