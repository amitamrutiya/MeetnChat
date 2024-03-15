"use client";

import { z } from "zod";

const formSchema = z.object({
  roomId: z.string().uuid(),
});

export default formSchema ;