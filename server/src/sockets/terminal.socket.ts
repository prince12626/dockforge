import { Server, Socket } from "socket.io";
import * as pty from "node-pty";
import { VPS } from "../models/vps.model.js";
import { auth } from "../config/better-auth.config.js";

export function setupTerminalSocket(io: Server) {
      console.log("🚀 Setting up terminal namespace");

      const terminal = io.of("/terminal");

      terminal.use(async (socket, next) => {
            console.log("\n==============================");
            console.log("🔌 TERMINAL MIDDLEWARE START");
            console.log("==============================");

            try {
                  console.log("Handshake query:", socket.handshake.query);

                  console.log(
                        "Handshake headers cookie:",
                        socket.handshake.headers.cookie,
                  );

                  const headers = new Headers();

                  const cookie = socket.handshake.headers.cookie;

                  if (cookie) {
                        headers.set("cookie", cookie);
                  }

                  console.log("Checking Better Auth session...");

                  const session = await auth.api.getSession({
                        headers,
                  });

                  console.log("SESSION:", session);

                  if (!session) {
                        console.log("❌ No session");

                        return next(new Error("Unauthorized"));
                  }

                  socket.data.userId = session.user.id;

                  console.log("USER ID:", socket.data.userId);

                  const vpsId = socket.handshake.query.vpsId as string;

                  console.log("VPS ID:", vpsId);

                  if (!vpsId) {
                        console.log("❌ VPS ID missing");

                        return next(new Error("VPS missing"));
                  }

                  console.log("Searching VPS...");

                  const vps = await VPS.findOne({
                        "container.id": vpsId,
                        userId: session.user.id,
                  });

                  console.log("FOUND VPS:", vps);

                  if (!vps) {
                        console.log("❌ VPS ownership failed");

                        return next(new Error("VPS not owned"));
                  }

                  socket.data.vps = vps.container?.id;

                  console.log("CONTAINER ID:", socket.data.vps);

                  if (!socket.data.vps) {
                        console.log("❌ Container ID missing");

                        return next(new Error("Container missing"));
                  }

                  console.log("✅ Middleware success");

                  next();
            } catch (error) {
                  console.log("🔥 MIDDLEWARE ERROR:", error);

                  next(new Error("Terminal auth failed"));
            }
      });

      terminal.on("connection", (socket: Socket) => {
            console.log("\n==============================");
            console.log("🔥 TERMINAL CONNECTED");
            console.log("==============================");

            const containerId = socket.data.vps;

            console.log("Container:", containerId);

            let shell;

            try {
                  console.log("Starting PTY...");

                  shell = pty.spawn(
                        "docker",
                        ["exec", "-it", containerId, "/bin/bash"],
                        {
                              name: "xterm-color",
                              cols: 80,
                              rows: 24,
                              cwd: process.cwd(),
                              env: {
                                    ...process.env,
                              },
                        },
                  );

                  console.log("✅ PTY CREATED");
            } catch (error) {
                  console.log("🔥 PTY ERROR:", error);

                  socket.emit("terminal-output", "\r\nPTY ERROR\r\n");

                  return;
            }

            shell.onData((data) => {
                  console.log("SHELL OUTPUT:", data);

                  socket.emit("terminal-output", data);
            });

            shell.onExit((code) => {
                  console.log("SHELL EXIT:", code);
            });

            socket.on("terminal-input", (data) => {
                  console.log("INPUT:", JSON.stringify(data));

                  shell.write(data);
            });

            socket.on("terminal-resize", ({ cols, rows }) => {
                  console.log("RESIZE:", cols, rows);

                  try {
                        shell.resize(cols, rows);
                  } catch (e) {}
            });

            socket.on("disconnect", (reason) => {
                  console.log("TERMINAL DISCONNECTED:", reason);

                  try {
                        shell.kill();
                  } catch (e) {}
            });
      });
}
