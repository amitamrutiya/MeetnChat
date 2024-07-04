import { z } from "zod";
import { emailValidation, usernameValidation } from "./profile-schema";

export const signInSchema = z.object({
  identifier: emailValidation.or(usernameValidation),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
