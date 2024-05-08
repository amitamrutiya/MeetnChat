"use client";

import { z } from "zod";

const roomSchema = z.object({
  roomId: z.string().uuid(),
});

export default roomSchema;
