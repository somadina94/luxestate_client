"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { io, type Socket } from "socket.io-client";
import { getApiBaseUrl } from "@/lib/api-config";

type ChatSocketContextType = {
  socket: Socket | null;
  send: (data: unknown) => Promise<{ ok: boolean; message?: string }>;
};

const ChatSocketContext = createContext<ChatSocketContextType>({
  socket: null,
  send: async () => ({ ok: false, message: "Socket is not connected" }),
});

function getSocketOrigin(): string | null {
  const explicit = process.env.NEXT_PUBLIC_SOCKET_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");
  const api = getApiBaseUrl();
  if (api) {
    try {
      const href = api.includes("://") ? api : `http://${api}`;
      const u = new URL(href);
      return `${u.protocol}//${u.host}`;
    } catch {
      return api.replace(/\/$/, "");
    }
  }
  return null;
}

/**
 * Socket.io (Engine.IO) realtime for chat. The browser may label the connection
 * "WebSocket" in DevTools when transport is `websocket` — that is still Socket.io,
 * not a raw `new WebSocket()` client.
 */
export function ChatSocketProvider({
  token,
  children,
}: {
  token: string;
  children: React.ReactNode;
}) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const origin = getSocketOrigin();
    if (!origin || !token) {
      socketRef.current?.disconnect();
      socketRef.current = null;
      setSocket(null);
      return;
    }

    // Polling first works better behind some reverse proxies; then upgrades to websocket.
    const s = io(origin, {
      path: "/socket.io",
      auth: { token },
      transports: ["polling", "websocket"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
      reconnectionDelayMax: 30000,
    });

    socketRef.current = s;
    setSocket(s);

    return () => {
      const inst = s;
      const delay = process.env.NODE_ENV === "development" ? 120 : 0;
      window.setTimeout(() => {
        inst.removeAllListeners();
        inst.disconnect();
        if (socketRef.current === inst) {
          socketRef.current = null;
          setSocket(null);
        }
      }, delay);
    };
  }, [token]);

  const send = useCallback((data: unknown) => {
    const s = socketRef.current ?? socket;
    if (!s?.connected) {
      return Promise.resolve({ ok: false, message: "Socket is not connected" });
    }
    return new Promise<{ ok: boolean; message?: string }>((resolve) => {
      s.timeout(10000).emit(
        "chat",
        data,
        (
          err: Error | null,
          response?: { ok?: boolean; message?: string },
        ) => {
          if (err) {
            resolve({ ok: false, message: "Message send timed out" });
            return;
          }
          resolve({
            ok: response?.ok === true,
            message: response?.message,
          });
        },
      );
    });
  }, [socket]);

  return (
    <ChatSocketContext.Provider value={{ socket, send }}>
      {children}
    </ChatSocketContext.Provider>
  );
}

export function useChatSocket() {
  return useContext(ChatSocketContext);
}
