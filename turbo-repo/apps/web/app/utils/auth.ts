import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { User } from "@prisma/client";
import db from "@repo/db/client";
import { getUserById } from "../actions/user/get-user";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: {
          id: user.id,
        },
        data: {
          emailVerified: new Date(),
          username: user.email?.split("@")[0],
        },
      });
    },
  },
  callbacks: {
    async signIn({ account, user }) {
      if (account?.provider !== "credentials") return true;

      const existingUser: User | null = await getUserById(user.id!);
      if (!existingUser || !existingUser.emailVerified) {
        return false;
      }
      return true;
    },
    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
      }
      session.user.username = token.username;
      // @ts-ignore
      session.user.name = token.name;
      session.user.image = token.image;
      session.user.bio = token.bio;
      session.user.phone_number = token.phone_number;
      session.user.is_online = token.is_online;
      if (token.email) {
        session.user.email = token.email;
      }
      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;

      if (existingUser.email && existingUser.username && existingUser.name) {
        token.name = existingUser.name;
        token.email = existingUser.email;
        token.username = existingUser.username;
      }
      token.bio = existingUser.bio;
      token.is_online = existingUser.is_online;
      token.emailVerified = existingUser.emailVerified;
      if (existingUser.image) token.image = existingUser.image;
      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
