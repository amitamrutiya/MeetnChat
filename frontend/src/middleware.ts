import NextAuth from "next-auth";
import authConfig from "@/auth.config";

const { auth } = NextAuth(authConfig);

// @ts-ignore
export default auth((req) => {
  const { nextUrl } = req;
  const path = nextUrl.pathname;
  const isPublicPath = path === "/";
  const isLoggendIn = !!req.auth;

  if (!isLoggendIn && !isPublicPath) {
    return Response.redirect(new URL(`/`));
  }
  return null;
});

export const config = {
  matcher: ["/", "/room/group-meet/:room*", "/room", "/logout"],
};
