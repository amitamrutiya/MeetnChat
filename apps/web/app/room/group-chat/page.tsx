"use client";

import { Button } from "@repo/ui";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Room() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const session = useSession();
  const user = session.data?.user;

  useEffect(() => {
    const newSocket = new WebSocket("ws://localhost:7000");
    newSocket.onopen = () => {
      const authData = JSON.stringify({
        type: "AUTH_DATA",
        payload: {
          userId: user?.id,
          name: user?.name,
        },
      });
      newSocket.send(authData);
      console.log("Connection established");
    };

    newSocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case "SEND_MESSAGE":
          console.log("Message sent:", message.payload.message);
          //  setMessages((prevMessages) => [...prevMessages, message.message]);
          break;
        case "messageUpdated":
          //  setMessages((prevMessages) =>
          //    prevMessages.map((msg) => (msg.id === message.message.id ? message.message : msg))
          //  );
          break;
        case "messageDeleted":
          //  setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== message.message));
          break;
        default:
          console.error("Unknown message type:", message.type);
      }
    };
    
    newSocket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
    setSocket(newSocket);

    return () => {
      if (newSocket.readyState === WebSocket.OPEN) {
        newSocket.close();
      }
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen w-full justify-center items-center">
      <h1>Group Chat</h1>
      <h2>This page is still under development. You can explore other functionality.</h2>
      <Button
        onClick={() =>
          socket?.send(
            JSON.stringify({
              type: "SEND_MESSAGE",
              payload: {
                message: "Hello, World!",
              },
            })
          )
        }
      >
        Send Hello Message
      </Button>
    </div>
  );
}
