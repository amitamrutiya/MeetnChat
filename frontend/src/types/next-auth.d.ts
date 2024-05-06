import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    _id?: string;
    is_verified?: boolean;
    username?: string;
  }

  interface Session {
    user: {
      _id?: string;
      is_verified?: boolean;
      username?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    is_verified?: boolean;
    username?: string;
  }
}
