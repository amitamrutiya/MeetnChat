import NextAuth from "next-auth";
import authConfig from "./utils/auth.config";

const { auth } = NextAuth(authConfig);

// @ts-ignore
export default auth((req) => {
  const { nextUrl } = req;
  const path = nextUrl.pathname;
  const isPublicPath = path === "/";
  const isLoggendIn = !!req.auth;

  if (!isLoggendIn && !isPublicPath) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    return Response.redirect(new URL(`/?callbackUrl=${encodedCallbackUrl}`, nextUrl));
  }
  return null;
});

export const config = {
  matcher: ["/", "/room/group-meet/:room*", "/room", "/logout"],
};
