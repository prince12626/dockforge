import { Server } from "socket.io";
import type { Server as HttpServer } from "node:http";

const userSocketMap = new Map<string, string>();

export let io: Server;

export function initializeSocket(server: HttpServer) {
      io = new Server(server, {
            cors: {
                  origin: process.env.CLIENT_URL,
                  methods: ["GET", "POST"],
                  credentials: true,
            },
            connectTimeout: 5000,
      });

      io.use((socket, next) => {
            const userId = socket.handshake.auth.userId;
            const token = socket.handshake.auth.token;

            if (!userId || !isValidToken(token)) {
                  return next(new Error("Authentication error"));
            }

            socket.data.userId = userId;
            next();
      });

      io.on("connection", (socket) => {
            const userId = socket.data.userId;
            userSocketMap.set(userId, socket.id);
            console.log(`User ${userId} connected with socket ${socket.id}`);

            socket.on("disconnect", () => {
                  userSocketMap.delete(userId);
                  console.log(`User ${userId} disconnected`);
            });
      });

      return io;
}

function isValidToken(token: string): boolean {
      return !!token;
}
