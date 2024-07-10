import WebSocket, { WebSocketServer } from "ws";
import http from "http";

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

wss.on("connection", (ws) => {
  ws.on("error", console.error);

  ws.on("message", (data: string) => {
    try {
      console.log("data", data);
      const message: Message = JSON.parse(data);
      switch (message.type) {
        case "CHAT_MESSAGE":
          broadcast(
            JSON.stringify({
              type: "CHAT_MESSAGE",
              payload: message.payload,
            })
          );
          break;
        default:
          console.error(`Unknown message type: ${message.type}`);
      }
    } catch (error) {
      console.error("Error parsing message:", error);
    }
  });

  ws.send("Hello! Message From Server!!");
});

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
