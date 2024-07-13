"use client";

import { RecoilRoot } from "recoil";
import * as React from "react";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@repo/ui";
import { SocketProvider } from "@repo/store";
import { WebSocketProvider } from "./web-socket-context";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <RecoilRoot>
        <SocketProvider>
          <WebSocketProvider>
          {children}
          </WebSocketProvider>
        </SocketProvider>
      </RecoilRoot>
      <Toaster />
    </SessionProvider>
  );
};
