"use client";

import React, { createContext, useMemo } from "react";
import { Socket } from "socket.io-client";
import { getSocket } from "../api/socket";

export const SocketContext = createContext<Socket | null>(null);

export const SocketProvider: React.FC<React.PropsWithChildren> = (props) => {
  const socket = useMemo(() => getSocket(), []);
  return (
    <SocketContext.Provider value={socket}>
      {props.children}
    </SocketContext.Provider>
  );
};
