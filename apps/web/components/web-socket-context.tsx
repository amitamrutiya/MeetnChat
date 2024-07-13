import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Chat } from "@prisma/client";

interface WebSocketContextProps {
  ws: WebSocket | null;
  loadChats: (user_id: string) => void;
  oldChatMessage: Chat[];
  sendMessage: (chat: Chat) => void;
}

export const WebSocketContext = createContext<WebSocketContextProps | null>(null);

export const WebSocketProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const { data: session } = useSession();
  const [oldChatMessage, setOldChatMessage] = useState<Chat[]>([]);
  useEffect(() => {
    if (session?.user) {
      const webSocket = new WebSocket("ws://localhost:7000");
      setWs(webSocket);

      webSocket.onopen = () => {
        const authData = JSON.stringify({
          type: "AUTH_DATA",
          payload: {
            user_id: session.user.id,
            name: session.user.name,
          },
        });
        webSocket.send(authData);
        console.log("Connection established");
      };

      webSocket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log("Received message", message);
        switch (message.type) {
          case "LOAD_EXISTING_CHATS":
            setOldChatMessage(message.payload);
            break;
          case "LOAD_NEW_CHAT":
            console.log("got data", message.payload);
            setOldChatMessage((oldChatMessage) => [...oldChatMessage, message.payload]);
            break;
        }
      };

      webSocket.onclose = () => {
        console.log("Connection closed");
      };

      webSocket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      return () => {
        webSocket.close();
      };
    }
  }, [session]);

  const sendMessage = useCallback(
    (chat: Chat) => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "NEW_CHAT", payload: chat }));
      }
    },
    [ws]
  );

  const loadChats = useCallback(
    (receiver_id: string) => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({ type: "EXISTING_CHATS", payload: { sender_id: session?.user.id, receiver_id: receiver_id } })
        );
      }
    },
    [ws]
  );

  return (
    <WebSocketContext.Provider value={{ ws, loadChats, oldChatMessage, sendMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};
