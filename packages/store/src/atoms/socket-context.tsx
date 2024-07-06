"use client";

import React, { createContext, useMemo } from "react";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import io, { Socket } from "socket.io-client";

let socket: Socket<DefaultEventsMap, DefaultEventsMap>;

export const SocketContext = createContext<Socket | null>(null);

const getSocket = () => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SERVER_API_URL ?? "");
    socket.on("connect", () => {
      console.log("Socket Connected:", socket.id);
    });
  }
  return socket;
};

export const SocketProvider: React.FC<React.PropsWithChildren> = (props) => {
  const socket = useMemo(() => getSocket(), []);
  return <SocketContext.Provider value={socket}>{props.children}</SocketContext.Provider>;
};
