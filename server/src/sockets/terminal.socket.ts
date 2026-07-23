import { Server, Socket } from "socket.io";
import Docker from "dockerode";
import { VPS } from "../models/vps.model.js";
import { auth } from "../config/better-auth.config.js";
import { docker } from "../utils/docker.js";

interface TerminalSocketData {
      userId: string;
      containerId: string;
}

const activeExecStreams = new Map<string, NodeJS.ReadWriteStream>();
const activeExecs = new Map<string, Docker.Exec>();

export function setupTerminalSocket(io: Server) {
      const terminal = io.of("/terminal");

      terminal.use(async (socket, next) => {
            try {
                  const cookie = socket.handshake.headers.cookie;
                  if (!cookie) return next(new Error("Unauthorized"));

                  const headers = new Headers();
                  headers.set("cookie", cookie);

                  const session = await auth.api.getSession({ headers });
                  if (!session) return next(new Error("Unauthorized"));

                  const vpsId = socket.handshake.query.vpsId;
                  if (typeof vpsId !== "string")
                        return next(new Error("Invalid VPS"));

                  const vps = await VPS.findOne({
                        "container.id": vpsId,
                        userId: session.user.id,
                  })
                        .select("container.id")
                        .lean();

                  if (!vps?.container?.id)
                        return next(new Error("VPS not found"));

                  socket.data = {
                        userId: session.user.id,
                        containerId: vps.container.id,
                  } as TerminalSocketData;

                  next();
            } catch (error) {
                  next(new Error("Authentication failed"));
            }
      });

      terminal.on("connection", async (socket: Socket) => {
            const { containerId } = socket.data as TerminalSocketData;

            const existingStream = activeExecStreams.get(containerId);
            if (existingStream) {
                  existingStream.end();
                  activeExecStreams.delete(containerId);
                  activeExecs.delete(containerId);
            }

            let stream: NodeJS.ReadWriteStream;
            let exec: Docker.Exec;
            let isAlive = false;

            try {
                  const container = docker.getContainer(containerId);

                  exec = await container.exec({
                        Cmd: [
                              "/bin/bash",
                              "-c",
                              `export PS1='\\u@\\h:\\w\\$ ' && exec /bin/bash`,
                        ],
                        AttachStdin: true,
                        AttachStdout: true,
                        AttachStderr: true,
                        Tty: true,
                  });

                  stream = await exec.start({ hijack: true, stdin: true });

                  activeExecStreams.set(containerId, stream);
                  activeExecs.set(containerId, exec);
                  isAlive = true;
            } catch (error) {
                  socket.emit(
                        "terminal-output",
                        "\r\nTerminal unavailable\r\n",
                  );
                  console.log(error);
                  return;
            }

            stream.on("data", (chunk: Buffer) => {
                  socket.emit("terminal-output", chunk.toString("utf-8"));
            });

            stream.on("end", () => {
                  isAlive = false;
                  activeExecStreams.delete(containerId);
                  activeExecs.delete(containerId);
                  if (socket.connected) {
                        socket.emit(
                              "terminal-output",
                              "\r\n\x1b[31mTerminal closed.\x1b[0m\r\n",
                        );
                        socket.disconnect(true);
                  }
            });

            stream.on("error", (err) => {
                  console.log(err);
            });

            socket.on("terminal-input", (data: string) => {
                  if (!isAlive) return;
                  if (typeof data !== "string") return;

                  try {
                        stream.write(data);
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
                        exec.resize({ h: rows, w: cols });
                  } catch (err) {
                        console.warn("Ignoring exec resize:", err);
                  }
            });

            socket.on("disconnect", () => {
                  const active = activeExecStreams.get(containerId);
                  if (active) {
                        active.end();
                        activeExecStreams.delete(containerId);
                        activeExecs.delete(containerId);
                  }
            });
      });
}
