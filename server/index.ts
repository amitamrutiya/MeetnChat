import http from "http";
import express from "express";
import { Socket, Server as SocketServer } from "socket.io";
import { v4 as uuidV4 } from "uuid";
import cors from "cors";
import { User, RoomUser } from "./types";

const PORT: number = Number(process.env.PORT) || 8000;
const app: express.Application = express();

const server: http.Server = http.createServer(app);
const io = new SocketServer({ cors: { origin: "*" } });
io.attach(server);

app.use(cors());
app.use(express.json());

const users: Map<string, User> = new Map<string, User>();
const roomUsers: Map<string, RoomUser> = new Map();

// When a new client connects to the server
io.on("connection", (socket: Socket) => {
  // Log the new connection
  console.log(`New Socket Connection: ${socket.id}`);

  // When a client joins a room
  socket.on("room:join", (data) => {
    // Destructure the data received from the client
    const { roomId, email, is_verified, name, username, image, sid } = data;
    // Set the user data in the users Map
    console.log(data);
    users.set(socket.id, {
      socketId: socket.id,
      roomId,
      email,
      is_verified,
      name,
      username,
      image,
      sid,
      joinedAt: new Date(),
      isConnected: false,
    });
    // Emit an event to refresh the user list
    io.emit("refresh:user-list");
  });

  // When a client initiates a peer call
  socket.on("peer:call", (data) => {
    const { to, offer, roomId } = data;
    // Emit an event to the recipient about the incoming call
    socket.to(to).emit("peer:incomming-call", {
      roomId,
      from: socket.id,
      user: users.get(socket.id),
      offer,
    });
  });

  // When a call is accepted
  socket.on("peer:call:accepted", (data) => {
    const { to, offer, roomId } = data;
    // Set the isConnected status to true for both users
    if (users.has(to)) {
      //@ts-ignore
      users.get(to)?.isConnected = true;
    }
    if (users.has(socket.id)) {
      //@ts-ignore
      users.get(socket.id)?.isConnected = true;
    }

    // Emit an event to the recipient that the call was accepted
    socket.to(to).emit("peer:call:accepted", {
      roomId,
      from: socket.id,
      user: users.get(socket.id),
      offer,
    });

    // Generate a new whiteboard ID
    const whiteboardID = uuidV4();
    // Emit the whiteboard ID to both users
    io.to([to, socket.id]).emit("whiteboard:id", { whiteboardID });

    // Emit an event to refresh the user list
    io.emit("refresh:user-list");
  });

  // When a client sends a negotiation offer
  socket.on("peer:negotiate", (data) => {
    const { to, offer } = data;
    // Emit the negotiation offer to the recipient
    socket.to(to).emit("peer:negotiate", { from: socket.id, offer });
  });

  // When a client sends a negotiation result
  socket.on("peer:negosiate:result", (data) => {
    const { to, offer } = data;
    // Emit the negotiation result to the recipient
    socket.to(to).emit("peer:negosiate:result", { from: socket.id, offer });
  });

  // When a client sends a whiteboard drawing
  socket.on("whiteboard:drawing", (data) => {
    const { to } = data;
    // Emit the whiteboard data to the recipient
    socket.to(to).emit("whiteboard:data", { from: socket.id, data: data });
  });

  // When a client sends a chat message
  socket.on("chat:message", (data) => {
    const { to, message } = data;
    // Emit the chat message to the sender
    socket.emit("chat:message", {
      from: socket.id,
      message,
      self: true,
      user: users.get(socket.id),
    });
    // Emit the chat message to the recipient
    socket.to(to).emit("chat:message", {
      from: socket.id,
      message,
      user: users.get(socket.id),
    });
  });

  // When a client disconnects
  socket.on("user-disconnect", () => {
    // Remove the user from the users Map
    users.delete(socket.id);
    // Emit an event that the user has disconnected
    io.emit("user-disconnected", { socketId: socket.id });
    // Emit an event to refresh the user list
    io.emit("refresh:user-list");
  });
});

app.get("/users", (req, res) => {
  const idleUsers: any[] = Array.from(users.values())
    .map((e) => ({
      ...e,
    }))
    .filter((e) => !e.isConnected);
  return res.json({ users: idleUsers });
});

server.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));
