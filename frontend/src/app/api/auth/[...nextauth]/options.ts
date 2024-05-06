import connectDB from "@/config/database";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import UserModel from "@/model/user.model";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",

      credentials: {
        email: { label: "Email", type: "text", placeholder: "Enter email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        await connectDB();
        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });
          if (!user) {
            throw new Error("No user found");
          }
          if (!user.is_verified) {
            throw new Error("Please verify your email first");
          }
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isPasswordCorrect) {
            throw new Error("Password is incorrect");
          }
          return user;
        } catch (error) {
          throw new Error("Error in authorization");
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.is_verified = token.is_verified;
        session.user.username = token.username;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.is_verified = user.is_verified;
        token.username = user.username;
      }
      return token;
    },
    async signIn({ account, user }) {
      if (account!.provider === "google") {
        return Boolean(user.is_verified && user!.email!.endsWith("@gmail.com"));
      }
      return false;
    },
  },
};
function GoogleProvider(arg0: {
  clientId: string | undefined;
  clientSecret: string | undefined;
}): import("next-auth/providers/index").Provider {
  throw new Error("Function not implemented.");
}
