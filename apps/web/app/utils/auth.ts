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

      const existingUser: User | null = await getUserById({ user_id: user.id! });
      if (!existingUser || !existingUser.emailVerified) {
        return false;
      }
      return true;
    },
    async session({ session, token }) {
      if (!token.sub) return session;

      const existingUser = await getUserById({ user_id: token.sub });
      if (existingUser && existingUser.email) {
        session.user.id = existingUser.id;
        session.user.name = existingUser.name;
        session.user.email = existingUser.email;
        session.user.username = existingUser.username;
        session.user.bio = existingUser.bio;
        session.user.is_online = existingUser.is_online;
        session.user.image = existingUser.image;
        session.user.phone_number = existingUser.phone_number;
        session.user.emailVerified = existingUser.emailVerified;
        session.user.createdAt = existingUser.createdAt;
        session.user.updatedAt = existingUser.updatedAt;
        session.user.roomId = existingUser.roomId;
        session.user.socketId = existingUser.socketId;
        session.user.friends = existingUser.friends;
        session.user.is_connected = existingUser.is_connected;
        session.user.is_online = existingUser.is_online;
        session.user.password = existingUser.password;
        session.user.verifyCode = existingUser.verifyCode;
        session.user.verifyCodeExpiry = existingUser.verifyCodeExpiry;
      }
      return session;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
  pages: {
    signIn: "/",
  },
});

interface RateLimiter {
  timestamps: Date[];
}
const userRateLimits = new Map<string, RateLimiter>();

export const rateLimit = (userId: string, rateLimitCount: number, rateLimitInterval: number): boolean => {
  const now = new Date();
  const userLimiter = userRateLimits.get(userId) ?? { timestamps: [] };

  userLimiter.timestamps = userLimiter.timestamps.filter(
    (timestamp) => now.getTime() - timestamp.getTime() < rateLimitInterval
  );

  if (userLimiter.timestamps.length >= rateLimitCount) {
    return false; // Rate limit exceeded
  }

  userLimiter.timestamps.push(now);
  userRateLimits.set(userId, userLimiter);
  return true;
};
