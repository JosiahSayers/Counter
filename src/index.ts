import { serve } from "bun";
import index from "./index.html";
import { InstanceStorage } from "./storage";

const storage = new InstanceStorage();
await storage.setupFile();

const subscriptions = {
  count: "count",
} as const;

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,

    "/api/count": {
      GET: async () => {
        return Response.json({ count: await storage.count() });
      },
    },

    "/api/increment": {
      POST: async () => {
        const count = await storage.increment();
        server.publish(subscriptions.count, (await storage.count()).toString());
        return Response.json({ count });
      },
    },

    "/api/decrement": {
      POST: async () => {
        const count = await storage.decrement();
        server.publish(subscriptions.count, (await storage.count()).toString());
        return Response.json({ count });
      },
    },

    "/subscribe": (req, server) => {
      if (server.upgrade(req)) {
        return;
      }

      return new Response("Unable to upgrade request", { status: 500 });
    },
  },

  websocket: {
    message(ws, message) {}, // a message is received
    async open(ws) {
      ws.subscribe(subscriptions.count);
      server.publish(subscriptions.count, (await storage.count()).toString());
    }, // a socket is opened
    close(ws, code, message) {
      ws.unsubscribe(subscriptions.count);
    }, // a socket is closed
    // drain(ws) {}, // the socket is ready to receive more data
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
