import { Server } from "socket.io";
import type { Server as HttpServer } from "node:http";

// import { registerTerminalSocket } from "./terminal.socket.js";

export let io: Server;

export function initializeSocket(server: HttpServer) {
      io = new Server(server, {
            cors: {
                  origin: process.env.CLIENT_URL,

                  credentials: true,
            },
      });

      io.on("connection", (socket) => {
            console.log("Socket connected:", socket.id);
            // registerTerminalSocket(socket);
      });

      return io;
}
