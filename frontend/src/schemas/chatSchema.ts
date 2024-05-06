"use client"

import { z } from "zod";

const chatSchema = z.object({
  message: z.string(),
});

export default chatSchema;