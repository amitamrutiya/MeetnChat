import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { signInSchema } from "./schemas/signinSchema";
import axios from "axios";

export default {
  providers: [
    Credentials({
      async authorize(credentials: any): Promise<any> {
        const validateFields = signInSchema.safeParse(credentials);

        if (validateFields.success) {
          try {
            const res = await axios.post("http://localhost:3000/api/user", {
              email: validateFields.data.identifier,
            });
            return res.data.user;
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
