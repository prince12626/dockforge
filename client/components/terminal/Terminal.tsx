"use client";

import { useEffect, useRef } from "react";

import { Terminal } from "xterm";
import { FitAddon } from "@xterm/addon-fit";

import "xterm/css/xterm.css";

export default function AppTerminal() {
      const terminalRef = useRef<HTMLDivElement>(null);

      useEffect(() => {
            if (!terminalRef.current) return;

            const terminal = new Terminal({
                  cursorBlink: true,

                  fontFamily: "JetBrains Mono, monospace",

                  fontSize: 14,

                  theme: {
                        background: "#09090B",
                        foreground: "#FAFAFA",
                        cursor: "#D8FF3E",
                        selectionBackground: "#3F3F46",
                  },
            });

            const fitAddon = new FitAddon();

            terminal.loadAddon(fitAddon);

            terminal.open(terminalRef.current);

            fitAddon.fit();

            terminal.write("root@production:~$ ");

            const resize = () => fitAddon.fit();

            window.addEventListener("resize", resize);

            return () => {
                  window.removeEventListener("resize", resize);
                  terminal.dispose();
            };
      }, []);

      return (
            <div className="flex flex-1 overflow-hidden">
                  <div
                        ref={terminalRef}
                        className="h-full w-full p-4 overflow-hidden"
                  />
            </div>
      );
}
