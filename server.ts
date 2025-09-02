import { serve } from "bun";

const server = serve({
  port: 3001,
  fetch(req, server) {
    if (server.upgrade(req)) return;
    return new Response("WebSocket server");
  },
  websocket: {
    open(ws) {
      ws.subscribe("gallery");
    },
    message(peer, message) {
      console.log(message);
      peer.publish("gallery", message);
    },
  },
});

console.log(`WebSocket server on port ${server.port}`);

