import { Server, Socket } from "socket.io";
import * as pty from "node-pty";
import { VPS } from "../models/vps.model.js";
import { auth } from "../config/better-auth.config.js";

interface TerminalSocketData {
      userId: string;
      containerId: string;
}

const activeTerminals = new Map<string, pty.IPty>();

export function setupTerminalSocket(io: Server) {
      const terminal = io.of("/terminal");

      terminal.use(async (socket, next) => {
            try {
                  const cookie = socket.handshake.headers.cookie;

                  if (!cookie) {
                        return next(new Error("Unauthorized"));
                  }

                  const headers = new Headers();
                  headers.set("cookie", cookie);

                  const session = await auth.api.getSession({
                        headers,
                  });

                  if (!session) {
                        return next(new Error("Unauthorized"));
                  }

                  const vpsId = socket.handshake.query.vpsId;

                  if (typeof vpsId !== "string") {
                        return next(new Error("Invalid VPS"));
                  }

                  const vps = await VPS.findOne({
                        "container.id": vpsId,
                        userId: session.user.id,
                  })
                        .select("container.id")
                        .lean();

                  if (!vps?.container?.id) {
                        return next(new Error("VPS not found"));
                  }

                  socket.data = {
                        userId: session.user.id,
                        containerId: vps.container.id,
                  } as TerminalSocketData;

                  next();
            } catch (error) {
                  next(new Error("Authentication failed"));
            }
      });

      terminal.on("connection", (socket: Socket) => {
            const { containerId } = socket.data as TerminalSocketData;

            const existing = activeTerminals.get(containerId);

            if (existing) {
                  existing.kill();
                  activeTerminals.delete(containerId);
            }
            console.log(process.env.PATH);
            let shell: pty.IPty;
            let isAlive = false;
            try {
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
                  activeTerminals.set(containerId, shell);
                  isAlive = true;
            } catch (error) {
                  socket.emit(
                        "terminal-output",
                        "\r\nTerminal unavailable\r\n",
                  );
                  console.log(error);
                  return;
            }

            shell.onData((data) => {
                  socket.emit("terminal-output", data);
            });

            shell.onExit((e) => {
                  isAlive = false;
                  activeTerminals.delete(containerId);
                  if (socket.connected) {
                        socket.emit(
                              "terminal-output",
                              "\r\n\x1b[31mTerminal closed.\x1b[0m\r\n",
                        );
                        socket.disconnect(true);
                  }
                  console.log(e);
            });

            socket.on("terminal-input", (data: string) => {
                  if (!isAlive) return;
                  if (typeof data !== "string") return;

                  try {
                        shell.write(data.replace(/\r/g, "\n"));
                  } catch {}
            });

            socket.on("terminal-resize", ({ cols, rows }) => {
                  if (!isAlive) return;

                  if (
                        typeof cols !== "number" ||
                        typeof rows !== "number" ||
                        cols <= 0 ||
                        rows <= 0
                  ) {
                        return;
                  }

                  try {
                        shell.resize(cols, rows);
                  } catch (err) {
                        console.warn("Ignoring PTY resize:", err);
                  }
            });

            socket.on("disconnect", () => {
                  const active = activeTerminals.get(containerId);

                  if (active) {
                        active.kill();
                        activeTerminals.delete(containerId);
                  }
            });
      });
}
