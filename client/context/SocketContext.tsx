"use client";

import { authClient } from "@/lib/auth-client";
import { useAppSelector } from "@/store/hooks";
import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { selected } = useAppSelector((state) => state.vps);
  useEffect(() => {
    if (!selected?.container?.id) {
      return;
    }

    let socketInstance: Socket | null = null;

    const initSocket = async () => {
      try {
        const { data } = await authClient.getSession();

        if (!data?.user?.id) {
          console.warn(
            "⚠️ No active session found. Socket connection skipped.",
          );
          return;
        }

        const socketURL = process.env.NEXT_PUBLIC_SOCKET_URL;

        if (!socketURL) {
          throw new Error("NEXT_PUBLIC_SOCKET_URL is not configured.");
        }

        socketInstance = io(new URL("/terminal", socketURL).toString(), {
          transports: ["websocket"],
          upgrade: false,
          forceNew: true,
          withCredentials: true,
          query: {
            vpsId: selected.container.id,
          },
        });

        socketInstance.on("connect", () => {
          console.log("🟢 Terminal Socket Connected! ID:", socketInstance?.id);
          setIsConnected(true);
        });

        socketInstance.on("connect_error", (error) => {
          console.error("🔴 Backend Auth Error:", error.message);
        });

        socketInstance.on("disconnect", (reason) => {
          console.log("🟡 Socket Disconnected:", reason);
          setIsConnected(false);
        });

        setSocket(socketInstance);
      } catch (error) {
        console.error("Failed to fetch session for socket:", error);
      }
    };

    initSocket();

    return () => {
      socketInstance?.disconnect();
    };
  }, [selected?.container?.id]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
