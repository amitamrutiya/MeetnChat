"use client";

import { Button } from "@repo/ui";
import { useEffect, useState } from "react";

export default function Room() {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const newSocket = new WebSocket("ws://localhost:7000");
    newSocket.onopen = () => {
      console.log("Connection established");
      newSocket.send("Hello Server!");
    };
    newSocket.onmessage = (message) => {
      console.log("Message received:", message.data);
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
      <Button onClick={() => socket?.send("Hello!")}>Send Hello Message</Button>
    </div>
  );
}
