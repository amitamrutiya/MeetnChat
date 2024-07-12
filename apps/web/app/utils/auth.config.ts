import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { getUserByIdentifier } from "../actions/user/get-user";
import { signInSchema } from "@repo/common";

export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    Credentials({
      async authorize(credentials): Promise<any> {
        const validateFields = signInSchema.safeParse(credentials);

        if (validateFields.success) {
          try {
            const user = await getUserByIdentifier(validateFields.data.identifier);
            if (!user || !user.password) return null;
            const passwordMatch = await bcrypt.compare(validateFields.data.password, user.password);

            if (passwordMatch) {
              return user;
            }
            return null;
          } catch (error) {
            throw new Error("Error in authorization" + error);
          }
        } else {
          console.log(validateFields.error);
          return null;
        }
      },
    }),
  ],
} satisfies NextAuthConfig;
