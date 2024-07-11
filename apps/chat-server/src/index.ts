import WebSocket, { WebSocketServer } from "ws";
import http from "http";
import db from "@repo/db/client";

const server = http.createServer((request, response) => {
  console.log(new Date() + " Received request for " + request.url);
  response.writeHead(200, { "Content-Type": "text/plain" });
  response.end("hi there");
});

const wss = new WebSocketServer({ server });

interface Message {
  type: string;
  payload: any;
}

const userIds = new Map<string, WebSocket>();

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("error", console.error);

  ws.on("message", async (data: string) => {
    try {
      const { type, payload }: Message = JSON.parse(data.toString());

      switch (type) {
        case "AUTH_DATA":
          await handleAuthData(ws, payload);
          break;
        case "SEND_MESSAGE":
          handleSendMessage(ws, payload);
          break;
        case "NEW_CHAT":
          handleNewChat(ws, payload);
          break;
        case "EXISTING_CHATS":
          await handleExistingChats(ws, payload);
          break;
        case "DELETE_CHAT":
          handleDeleteChat(ws, payload);
          break;
        case "UPDATE_CHAT":
          handleUpdateChat(ws, payload);
          break;
        case "GROUP_CHAT":
          handleGroupChat(ws, payload);
          break;
        case "DELETE_GROUP_CHAT":
          handleDeleteGroupChat(ws, payload);
          break;
        case "UPDATE_GROUP_CHAT":
          handleUpdateGroupChat(ws, payload);
          break;
        default:
          ws.send(JSON.stringify({ type: "error", message: "Unknown message type" }));
      }
    } catch (error) {
      console.error("Error parsing message:", error);
      ws.send(JSON.stringify({ type: "error", message: "Invalid JSON format" }));
    }
  });

  ws.on("close", async () => {
    console.log("Client disconnected");
    let id = "";
    for (const [userId, client] of userIds.entries()) {
      if (client === ws) {
        await db.user.update({
          where: { id: userId },
          data: { is_online: false },
        });
        id = userId;
        userIds.delete(userId);
        break;
      }
    }
    broadcast(JSON.stringify({ type: "GET_OFFLINE_USER", payload: { id } }));
  });

  ws.send(JSON.stringify({ type: "info", message: "Hello! Message From Server!!" }));
});

async function handleAuthData(ws: WebSocket, payload: any) {
  try {
    console.log(payload.name + " connected");
    const userId = payload.userId;
    const user = await db.user.update({
      where: { id: userId },
      data: { is_online: true },
    });
    userIds.set(userId, ws);
    console.log("User:", user);
    broadcast(JSON.stringify({ type: "GET_ONLINE_USER", payload: { userId } }), ws);
  } catch (error) {
    console.error("Error during authentication:", error);
    ws.send(JSON.stringify({ type: "error", message: "Authentication failed" }));
  }
}

function handleSendMessage(ws: WebSocket, payload: any) {
  console.log("Chat message:", payload);
  broadcast(JSON.stringify({ type: "SEND_MESSAGE", payload }), ws);
}

function handleNewChat(ws: WebSocket, payload: any) {
  console.log("New chat:", payload);
  broadcast(JSON.stringify({ type: "LOAD_NEW_CHAT", payload: payload.toString() }), ws);
}

async function handleExistingChats(ws: WebSocket, payload: any) {
  try {
    console.log("Existing chats:", payload);
    const { sender_id, receiver_id } = payload;
    const chats = await db.chat.findMany({
      where: {
        OR: [
          { sender_id, receiver_id },
          { sender_id: receiver_id, receiver_id: sender_id },
        ],
      },
    });
    ws.send(JSON.stringify({ type: "LOAD_EXISTING_CHATS", payload: chats }));
  } catch (error) {
    console.error("Error loading existing chats:", error);
    ws.send(JSON.stringify({ type: "error", message: "Failed to load existing chats" }));
  }
}

function handleDeleteChat(ws: WebSocket, payload: any) {
  console.log("Delete chat:", payload);
  broadcast(JSON.stringify({ type: "CHAT_MESSAGE_DELETED", payload: payload.id.toString() }), ws);
}

function handleUpdateChat(ws: WebSocket, payload: any) {
  console.log("Update chat:", payload);
  broadcast(JSON.stringify({ type: "CHAT_MESSAGE_UPDATED", payload: payload.toString() }), ws);
}

function handleGroupChat(ws: WebSocket, payload: any) {
  console.log("Group chat:", payload);
  broadcast(JSON.stringify({ type: "LOAD_GROUP_CHAT", payload: payload.toString() }), ws);
}

function handleDeleteGroupChat(ws: WebSocket, payload: any) {
  console.log("Delete group chat:", payload);
  broadcast(JSON.stringify({ type: "GROUP_CHAT_DELETED", payload: payload.toString() }), ws);
}

function handleUpdateGroupChat(ws: WebSocket, payload: any) {
  console.log("Update group chat:", payload);
  broadcast(JSON.stringify({ type: "GROUP_CHAT_UPDATED", payload: payload.toString() }), ws);
}

function broadcast(data: string, ws?: WebSocket) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      if (!ws || client !== ws) {
        client.send(data);
      }
    }
  });
}

server.listen(7000, () => {
  console.log(new Date() + " Server is listening on port 7000");
});
