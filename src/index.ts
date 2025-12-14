import { serve } from "bun";
import index from "./index.html";
import { InstanceStorage } from "./storage";

const storage = new InstanceStorage();
await storage.setupFile();

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
        return Response.json({ count });
      },
    },

    "/api/decrement": {
      POST: async () => {
        const count = await storage.decrement();
        return Response.json({ count });
      },
    },
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
