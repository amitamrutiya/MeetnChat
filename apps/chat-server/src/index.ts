import WebSocket, { WebSocketServer } from "ws";
import http from "http";
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
        case "NEW_FRIEND_REQUEST":
          broadcast(JSON.stringify({ type: "NEW_FRIEND_REQUESTED", payload: payload }));
          break;
        case "ACCEPT_FRIEND_REQUEST":
          broadcast(JSON.stringify({ type: "ACCEPTED_FRIEND_REQUEST", payload: payload }));
          break;
        case "REJECT_FRIEND_REQUEST":
          broadcast(JSON.stringify({ type: "REJECTED_FRIEND_REQUEST", payload: payload }));
          break;
        case "ADD_MEMBERS":
          selectedBroadcast(JSON.stringify({ type: "MEMBERS_ADDED", payload: payload }), ws);
          break;
        case "REMOVE_MEMBER":
          selectedBroadcast(JSON.stringify({ type: "MEMBER_REMOVED", payload: payload }), ws);
          break;
        case "NEW_GROUP":
          selectedBroadcast(JSON.stringify({ type: "NEW_GROUP_CREATED", payload: payload }), ws);
          break;
        case "EDIT_GROUP":
          selectedBroadcast(JSON.stringify({ type: "GROUP_EDITED", payload: payload }), ws);
          break;
        case "DELETE_GROUP":
          selectedBroadcast(JSON.stringify({ type: "GROUP_DELETED", payload: payload }), ws);
          break;
        case "LEAVE_GROUP":
          selectedBroadcast(JSON.stringify({ type: "LEFT_GROUP", payload: payload }), ws);
          break;
        case "SEND_GROUP_MESSAGE":
          selectedBroadcast(JSON.stringify({ type: "GROUP_MESSAGE_SENT", payload: payload }), ws);
          break;
        case "EDIT_GROUP_MESSAGE":
          broadcast(JSON.stringify({ type: "GROUP_MESSAGE_EDITED", payload: payload }));
          break;
        case "DELETE_GROUP_MESSAGE":
          selectedBroadcast(JSON.stringify({ type: "GROUP_MESSAGE_DELETED", payload: payload }), ws);
          break;
        case "CLEAR_ALL_MESSAGES":
          selectedBroadcast(JSON.stringify({ type: "ALL_MESSAGES_CLEARED", payload: payload }), ws);
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
    userIds.set(user_id, ws);
    selectedBroadcast(JSON.stringify({ type: "GET_ONLINE_USER", payload: { user_id } }), ws);
  } catch (error) {
    console.error("Error during authentication:", error);
    ws.send(JSON.stringify({ type: "error", message: "Authentication failed" }));
  }
}

async function handleNewChat(ws: WebSocket, payload: Chat) {
  console.log("New chat:", payload);
  broadcast(JSON.stringify({ type: "LOAD_NEW_CHAT", payload: payload }));
}

async function handleDeleteChat(ws: WebSocket, payload: string) {
  console.log("Delete chat:", payload);
  selectedBroadcast(JSON.stringify({ type: "CHAT_MESSAGE_DELETED", payload }), ws);
}

async function handleUpdateChat(ws: WebSocket, payload: string) {
  console.log("Update chat:", payload);
  selectedBroadcast(JSON.stringify({ type: "CHAT_MESSAGE_UPDATED", payload }), ws);
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
