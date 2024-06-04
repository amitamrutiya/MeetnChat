import "next-auth";
import { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User {
    _id?: string;
    is_verified?: boolean;
    username?: string;
    email?: string;
    fullname?: string;
    profile_image?: string;
    bio?: string;
    phone_number?: string;
    is_online?: boolean;
  }

  interface Session {
    user: {
      _id?: string;
      is_verified?: boolean;
      username?: string;
      email?: string;
      fullname?: string;
      profile_image?: string;
      bio?: string;
      phone_number?: string;
      is_online?: boolean;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    is_verified?: boolean;
    username?: string;
    email?: string;
    fullname?: string;
    profile_image?: string;
    bio?: string;
    phone_number?: string;
    is_online?: boolean;
  }
}
