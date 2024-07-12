import { z } from "zod";

export const chatValidationSchema = z.object({
  message: z.string().max(300, { message: "Message must be less than 300 characters" }),
});
