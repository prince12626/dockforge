"use client";

import { useEffect, useRef, useState } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { io, Socket } from "socket.io-client";
import "@xterm/xterm/css/xterm.css";

export default function TerminalComponent({ vpsId }: { vpsId: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<Terminal | null>(null);
  const socketRef = useRef<Socket | null>(null);

  const [status, setStatus] = useState<"connecting" | "connected" | "error">(
    "connecting",
  );

  useEffect(() => {
    if (!containerRef.current || !vpsId) return;

    const terminal = new Terminal({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: "JetBrains Mono, monospace",
      scrollback: 5000,
      theme: {
        background: "#09090b",
        foreground: "#e4e4e7",
        cursor: "#ffffff",
      },
    });

    const fitAddon = new FitAddon();

    terminal.loadAddon(fitAddon);
    terminal.open(containerRef.current);

    terminalRef.current = terminal;

    const fitTerminal = () => {
      const container = containerRef.current;

      if (!container || !terminal.element) return;

      // hidden element par fit mat karo
      if (container.offsetWidth === 0 || container.offsetHeight === 0) {
        return;
      }

      try {
        fitAddon.fit();
      } catch (err) {
        console.warn("Fit failed:", err);
      }
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        fitTerminal();
        terminal.focus();
      });
    });

    const socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}/terminal`, {
      transports: ["websocket"],
      withCredentials: true,
      query: { vpsId },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setStatus("connected");

      fitTerminal();

      socket.emit("terminal-resize", {
        cols: terminal.cols,
        rows: terminal.rows,
      });
    });

    socket.on("connect_error", (err) => {
      console.error(err);

      setStatus("error");

      terminal.writeln("");
      terminal.writeln("\x1b[31mConnection failed\x1b[0m");
    });

    socket.on("terminal-output", (data: string) => {
      terminal.write(data);
    });

    terminal.onData((data) => {
      socket.emit("terminal-input", data);
    });

    const handleResize = () => {
      fitTerminal();

      socket.emit("terminal-resize", {
        cols: terminal.cols,
        rows: terminal.rows,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);

      socket.disconnect();
      terminal.dispose();

      socketRef.current = null;
      terminalRef.current = null;
    };
  }, [vpsId]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl border border-zinc-800 bg-[#09090b]">
      <div className="absolute top-3 right-4 z-10 flex items-center gap-2 text-xs text-zinc-400">
        <span
          className={`h-2 w-2 rounded-full ${
            status === "connected"
              ? "bg-green-500"
              : status === "error"
                ? "bg-red-500"
                : "bg-yellow-500"
          }`}
        />

        {status === "connected"
          ? "Connected"
          : status === "error"
            ? "Offline"
            : "Connecting..."}
      </div>

      <div ref={containerRef} className="h-full w-full p-4" />
    </div>
  );
}
