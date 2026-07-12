"use client";

import { useEffect, useRef, useState } from "react";

import { Terminal } from "xterm";

import { FitAddon } from "@xterm/addon-fit";

import { io, Socket } from "socket.io-client";

import "xterm/css/xterm.css";

export default function TerminalComponent({ vpsId }: { vpsId: string }) {
      const ref = useRef<HTMLDivElement>(null);

      const socketRef = useRef<Socket | null>(null);

      const terminalRef = useRef<Terminal | null>(null);

      const [status, setStatus] = useState<
            "connecting" | "connected" | "error"
      >("connecting");

      useEffect(() => {
            if (!ref.current || !vpsId) return;

            const terminal = new Terminal({
                  cursorBlink: true,

                  fontSize: 14,

                  fontFamily: "JetBrains Mono, monospace",

                  scrollback: 5000,

                  theme: {
                        background: "#09090b",
                        foreground: "#e4e4e7",
                        cursor: "#fff",
                  },
            });

            const fit = new FitAddon();

            terminal.loadAddon(fit);

            terminal.open(ref.current);

            terminal.focus();

            setTimeout(() => {
                  fit.fit();
            }, 100);

            terminalRef.current = terminal;

            const socket = io(
                  `${process.env.NEXT_PUBLIC_SOCKET_URL}/terminal`,
                  {
                        withCredentials: true,

                        transports: ["websocket"],

                        query: {
                              vpsId,
                        },
                  },
            );

            socketRef.current = socket;

            socket.on("connect", () => {
                  console.log("Terminal connected");

                  setStatus("connected");

                  socket.emit("terminal-resize", {
                        cols: terminal.cols,
                        rows: terminal.rows,
                  });
            });

            socket.on("connect_error", (err) => {
                  console.error(err.message);

                  setStatus("error");

                  terminal.write("\r\n\x1b[31mConnection failed\x1b[0m\r\n");
            });

            socket.on("terminal-output", (data: string) => {
                  terminal.write(data);
            });

            terminal.onData((data) => {
                  socket.emit("terminal-input", data);
            });

            const resize = () => {
                  fit.fit();

                  socket.emit("terminal-resize", {
                        cols: terminal.cols,
                        rows: terminal.rows,
                  });
            };

            window.addEventListener("resize", resize);

            return () => {
                  window.removeEventListener("resize", resize);

                  socket.disconnect();

                  terminal.dispose();

                  socketRef.current = null;

                  terminalRef.current = null;
            };
      }, [vpsId]);

      return (
            <div
                  className="
      relative
      h-full
      w-full
      overflow-hidden
      rounded-xl
      border
      border-zinc-800
      bg-[#09090b]
      "
            >
                  <div
                        className="
                        noscroll
            absolute
            right-4
            top-3
            z-10
            flex
            items-center
            gap-2
            text-xs
            text-zinc-400
            "
                  >
                        <span
                              className={`
            h-2
            w-2
            rounded-full
            ${
                  status === "connected"
                        ? "bg-green-500"
                        : status === "error"
                          ? "bg-red-500"
                          : "bg-yellow-500"
            }
            `}
                        />

                        {status === "connected"
                              ? "Connected"
                              : status === "error"
                                ? "Offline"
                                : "Connecting..."}
                  </div>

                  <div
                        ref={ref}
                        className="
            h-full
            w-full
            p-4
            "
                  />
            </div>
      );
}
