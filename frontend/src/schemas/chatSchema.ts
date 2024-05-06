"use client";

import { z } from "zod";

const chatSchema = z.object({
  message: z
    .string()
    .max(300, { message: "Message must be less than 300 characters" }),
});

export default chatSchema;
