"use client";
import React from "react";
import { io, Socket } from "socket.io-client";

export const SocketContext = React.createContext<Socket | null>(null);

export const useSocket = () => {
  const context = React.useContext(SocketContext);
  console.log("context", context);
  return context;
};

export const SocketProvider: React.FC<React.PropsWithChildren> = (props) => {
  const socket = React.useMemo(
    () => io(process.env.NEXT_PUBLIC_SERVER_API_URL as string),
    []
  );
  return (
    <SocketContext.Provider value={socket}>
      {props.children}
    </SocketContext.Provider>
  );
};
