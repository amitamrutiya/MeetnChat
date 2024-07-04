import { z } from "zod";
import { usernameValidation } from "./profile-schema";

export const signUpSchema = z.object({
  fullname: z
    .string()
    .min(3, { message: "Name must be at least 3 characters" }),
  username: usernameValidation,
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});
