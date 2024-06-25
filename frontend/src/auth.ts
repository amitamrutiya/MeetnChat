import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { getUserById } from "./actions/user";
import { db } from "./lib/db";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { User } from "@prisma/client";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  callbacks: {
    async signIn({ account, profile, user }) {
      if (account?.provider === "google") {
        console.log("profile", profile);
        return !!profile?.email_verified;
      }
      if (account?.provider !== "credentials") return true;

      const existingUser: User | null = await getUserById(user.id!);
      console.log("existingUser", existingUser);
      if (!existingUser || !existingUser.is_verified) {
        return false;
      }
      return true;
    },
    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
      }
      session.user.is_verified = token.is_verified;
      session.user.username = token.username;
      // @ts-ignore
      session.user.fullname = token.name;
      session.user.profile_image = token.profile_image;
      session.user.bio = token.bio;
      session.user.phone_number = token.phone_number;
      session.user.is_online = token.is_online;
      if (token.email) {
        session.user.email = token.email;
      }
      console.log("session", session);
      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;

      token.name = existingUser.fullname;
      token.email = existingUser.email;
      token.username = existingUser.username;
      token.bio = existingUser.bio;
      token.is_online = existingUser.is_online;
      token.is_verified = existingUser.is_verified;
      token.username = existingUser.username;
      token.picture = existingUser.profile_image;
      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
