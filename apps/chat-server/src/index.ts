import WebSocket, { WebSocketServer } from "ws";
import http from "http";
import db from "@repo/db/client";
import { Chat } from "@prisma/client";

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
          ws.send(JSON.stringify({ type: "error", message: `Unknown message type ${type}` }));
      }
    } catch (error) {
      console.error("Error parsing message:", error);
      ws.send(JSON.stringify({ type: "error", message: "Invalid JSON format" }));
    }
  });

  ws.on("close", async () => {
    console.log("Client disconnected");
    let id = "";
    for (const [user_id, client] of userIds.entries()) {
      if (client === ws) {
        console.log("User disconnected:", user_id);
        await db.user.update({
          where: { id: user_id },
          data: { is_online: false },
        });
        id = user_id;
        userIds.delete(user_id);
        break;
      }
    }
    selectedBroadcast(JSON.stringify({ type: "GET_OFFLINE_USER", payload: { id } }));
  });

  ws.send(JSON.stringify({ type: "info", message: "Hello! Message From Server!!" }));
});

async function handleAuthData(ws: WebSocket, payload: any) {
  try {
    console.log(payload.name + " connected");
    const user_id = payload.user_id;
    await db.user.update({
      where: { id: user_id },
      data: { is_online: true },
    });
    userIds.set(user_id, ws);
    selectedBroadcast(JSON.stringify({ type: "GET_ONLINE_USER", payload: { user_id } }), ws);
  } catch (error) {
    console.error("Error during authentication:", error);
    ws.send(JSON.stringify({ type: "error", message: "Authentication failed" }));
  }
}

async function handleNewChat(ws: WebSocket, payload: Chat) {
  console.log("New chat:", payload);
  // ws.send(JSON.stringify({ type: "LOAD_NEW_CHAT", payload: payload }));
  broadcast(JSON.stringify({ type: "LOAD_NEW_CHAT", payload: payload }));
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

async function handleDeleteChat(ws: WebSocket, payload: any) {
  // const { chat_id } = payload;
  // await db.chat.delete({
  //   where: { id: chat_id },
  // });
  selectedBroadcast(JSON.stringify({ type: "CHAT_MESSAGE_DELETED", payload: payload.toString() }), ws);
}

async function handleUpdateChat(ws: WebSocket, payload: any) {
  console.log("Update chat:", payload);
  const { chat_id, message } = payload;
  const chatExists = await db.chat.findUnique({
    where: { id: chat_id },
  });

  if (!chatExists) {
    console.log(`Chat with ID ${chat_id} not found.`);
    // Handle the "not found" case, e.g., by sending a response to the client
    return; // Exit the function or throw an error
  }

  const updatedChat = await db.chat.update({
    where: { id: chat_id },
    data: { message: message },
  });
  console.log("Updated chat:", updatedChat);

  selectedBroadcast(JSON.stringify({ type: "CHAT_MESSAGE_UPDATED", payload: payload.toString() }), ws);
}

function handleGroupChat(ws: WebSocket, payload: any) {
  console.log("Group chat:", payload);
  selectedBroadcast(JSON.stringify({ type: "LOAD_GROUP_CHAT", payload: payload.toString() }), ws);
}

function handleDeleteGroupChat(ws: WebSocket, payload: any) {
  console.log("Delete group chat:", payload);
  selectedBroadcast(JSON.stringify({ type: "GROUP_CHAT_DELETED", payload: payload.toString() }), ws);
}

function handleUpdateGroupChat(ws: WebSocket, payload: any) {
  console.log("Update group chat:", payload);
  selectedBroadcast(JSON.stringify({ type: "GROUP_CHAT_UPDATED", payload: payload.toString() }), ws);
}

function selectedBroadcast(data: string, ws?: WebSocket) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      if (!ws || client !== ws) {
        client.send(data);
      }
    }
  });
}

function broadcast(data: string) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}

server.listen(7000, () => {
  console.log(new Date() + " Server is listening on port 7000");
});
