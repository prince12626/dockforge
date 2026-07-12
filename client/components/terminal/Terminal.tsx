"use client";

import { useEffect, useRef } from "react";

import { Terminal } from "xterm";

import { FitAddon } from "@xterm/addon-fit";

import { io } from "socket.io-client";

import "xterm/css/xterm.css";

export default function TerminalComponent({ vpsId }: { vpsId: string }) {
      const ref = useRef<HTMLDivElement>(null);

      useEffect(() => {
            if (!ref.current || !vpsId) return;

            const terminal = new Terminal({
                  cursorBlink: true,
                  fontSize: 14,
                  theme: {
                        background: "#0c0c0c",
                        foreground: "#fff",
                  },
            });

            const fit = new FitAddon();

            terminal.loadAddon(fit);

            terminal.open(ref.current);

            fit.fit();

            const socket = io("http://localhost:3000/terminal", {
                  withCredentials: true,
                  query: {
                        vpsId,
                  },
            });

            socket.on("connect", () => {
                  console.log("terminal connected");
            });

            socket.on("terminal-output", (data) => {
                  terminal.write(data);
            });

            terminal.onData((data) => {
                  socket.emit("terminal-input", data);
            });

            window.addEventListener("resize", () => {
                  fit.fit();

                  socket.emit("terminal-resize", {
                        cols: terminal.cols,
                        rows: terminal.rows,
                  });
            });

            return () => {
                  socket.disconnect();

                  terminal.dispose();
            };
      }, [vpsId]);

      return <div ref={ref} className="h-full w-full" />;
}
