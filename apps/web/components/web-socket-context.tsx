import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Chat } from "@prisma/client";
import { updateOnlineStatus } from "app/actions/user/update-online-status";
import { useRecoilState } from "recoil";
import { oldChatState } from "@repo/store";

interface WebSocketContextProps {
  ws: WebSocket | null;
  sendMessage: (chat: Chat) => void;
}

export const WebSocketContext = createContext<WebSocketContextProps | null>(null);

export const WebSocketProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const { data: session } = useSession();
  const [oldChats, setOldChats] = useRecoilState(oldChatState);

  useEffect(() => {
    if (session?.user) {
      const webSocket = new WebSocket("ws://localhost:7000");
      setWs(webSocket);

      webSocket.onopen = async () => {
        await updateOnlineStatus({ userId: session.user.id, online: true });
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

      webSocket.onmessage = async (event) => {
        const message = JSON.parse(event.data);
        console.log("Received message", message);
        switch (message.type) {
          case "LOAD_NEW_CHAT": {
            setOldChats((oldChatMessage) => [...oldChatMessage, message.payload]);
            break;
          }
        }
      };

      webSocket.onclose = async () => {
        await updateOnlineStatus({ userId: session.user.id, online: false });
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


  return (
    <WebSocketContext.Provider value={{ ws, sendMessage }}>{children}</WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};
