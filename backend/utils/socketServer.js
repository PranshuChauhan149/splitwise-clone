import { Server } from "socket.io";

let io;

const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

export const initSocketServer = (server) => {
  if (!io) {
    io = new Server(server, {
      cors: {
        origin: clientUrl,
        methods: ["GET", "POST"],
        credentials: true,
      },
    });
  }

  return io;
};

export const getSocketServer = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};
