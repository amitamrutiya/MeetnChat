import "next-auth";
import { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";
import { User as PrismaUser } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: PrismaUser;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: PrismaUser;
  }
}
