import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { signInSchema } from "./schemas/signinSchema";
import { getUserByIdentifier } from "./actions/user";

export default {
  providers: [
    Credentials({
      async authorize(credentials: any): Promise<any> {
        const validateFields = signInSchema.safeParse(credentials);

        if (validateFields.success) {
          try {
            const user = await getUserByIdentifier(credentials.identifier);
            return user;
          } catch (error) {
            throw new Error("Error in authorization" + error);
          }
        } else {
          console.log(validateFields.error);
          return null;
        }
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
} satisfies NextAuthConfig;
