import NextAuth from "next-auth";
import authConfig from "./auth.config";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  session: {
    strategy: "jwt",
  },
  ...authConfig,
  callbacks: {
    async signIn({ account, user }) {
      if (account?.provider === "google") {
        // return Boolean(user.is_verified && user.email?.endsWith("@gmail.com"));
        return true;
      }
      return true; // Do different verification for other providers that don't have `email_verified`
    },
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.is_verified = user.is_verified;
        token.username = user.username;
        token.email = user.email;
        token.picture = user.profile_image;
        token.is_online = user.is_online;
        token.profile_image = user.profile_image;
        token.phone_number = user.phone_number;
        token.bio = user.bio;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.is_verified = token.is_verified;
        session.user.username = token.username;
        session.user.email = token.email;
        session.user.fullname = token.fullname;
        session.user.profile_image = token.profile_image;
        session.user.bio = token.bio;
        session.user.phone_number = token.phone_number;
        session.user.is_online = token.is_online;
      }
      return session;
    },
  },
});
