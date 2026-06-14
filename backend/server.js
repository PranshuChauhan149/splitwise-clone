import http from "http";
import app from "./app.js";
import { initPrisma } from "./utils/prismaClient.js";
import { initSocketServer } from "./utils/socketServer.js";
import { registerMessageSocketHandlers } from "./sockets/messageSocket.js";

const envPort = Number(process.env.PORT) || 5000;
const fallbackPort = 4000;

const startServer = (port) => {
  const server = http.createServer(app);
  const io = initSocketServer(server);
  registerMessageSocketHandlers(io);

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      if (port === envPort && envPort !== fallbackPort) {
        console.warn(`Port ${envPort} is already in use. Trying port ${fallbackPort} instead.`);
        startServer(fallbackPort);
        return;
      }
      console.error(`Port ${port} is already in use. Please free the port or set a different PORT in .env.`);
      process.exit(1);
    }
    throw error;
  });

  initPrisma();

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
};

startServer(envPort);
