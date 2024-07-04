"use client";

import { RecoilRoot } from "recoil";
import * as React from "react";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@repo/ui";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <RecoilRoot>{children}</RecoilRoot>
      <Toaster />
    </SessionProvider>
  );
};
