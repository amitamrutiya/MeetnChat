import { DefaultEventsMap } from "@socket.io/component-emitter";
import io, { Socket } from "socket.io-client";
let socket: Socket<DefaultEventsMap, DefaultEventsMap>;

export const getSocket = () => {
    if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SERVER_API_URL ?? "");
    socket.on("connect", () => {
      console.log("Socket Connected:", socket.id);
    });
  }
  return socket;
};
