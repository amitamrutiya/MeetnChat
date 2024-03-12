import React, { createContext, useMemo } from "react";
import { io, Socket } from "socket.io-client";

export const SocketContext = createContext<Socket | null>(null);

export const SocketProvider: React.FC<React.PropsWithChildren> = (props) => {
  const socket = useMemo(
    () => io(process.env.NEXT_PUBLIC_SERVER_API_URL as string),
    []
  );
  return (
    <SocketContext.Provider value={socket}>
      {props.children}
    </SocketContext.Provider>
  );
};
