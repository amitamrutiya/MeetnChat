"use client";

import { RecoilRoot } from "recoil";
import * as React from "react";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@repo/ui";
import { SocketProvider } from "@repo/store";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <RecoilRoot>
        <SocketProvider>{children}</SocketProvider>
      </RecoilRoot>
      <Toaster />
    </SessionProvider>
  );
};
