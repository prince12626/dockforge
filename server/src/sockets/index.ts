import { Server } from "socket.io";
import type { Server as HttpServer } from "node:http";
import { auth } from "../config/better-auth.config.js";
import { setupTerminalSocket } from "./terminal.socket.js";

export let io: Server;

export function initializeSocket(server: HttpServer) {
      io = new Server(server, {
            cors: {
                  origin: "http://localhost:4000",
                  credentials: true,
            },
      });

      io.use(async (socket, next) => {
            try {
                  const headers = new Headers();

                  const cookie = socket.handshake.headers.cookie;

                  if (cookie) {
                        headers.set("cookie", cookie);
                  }

                  const session = await auth.api.getSession({
                        headers,
                  });

                  if (!session) {
                        return next(new Error("Unauthorized"));
                  }

                  socket.data.userId = session.user.id;

                  next();
            } catch (error) {
                  console.log(error);

                  next(new Error("Authentication failed"));
            }
      });

      setupTerminalSocket(io);

      io.on("connection", (socket) => {
            console.log("Socket connected:", socket.data.userId);

            socket.on("disconnect", () => {
                  console.log("Socket disconnected:", socket.id);
            });
      });

      return io;
}
