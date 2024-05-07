import { z } from "zod";

export const verifySchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  code: z.string().length(6, "Verification code must be 6 digits"),
});
