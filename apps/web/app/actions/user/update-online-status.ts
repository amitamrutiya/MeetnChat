"use server";

import db from "@repo/db/client";

export async function updateOnlineStatus({ userId, online }: { userId: string; online: boolean }) {
  const user = await db.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new Error("User not found");
  }

  await db.user.update({
    where: { id: userId },
    data: {
      is_online: online,
    },
  });
}
