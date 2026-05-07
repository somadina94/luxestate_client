"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useChatSocket } from "@/context/socket-io-provider";
import { Message, ChatWSPayload } from "@/types";
import { chatService } from "@/services";

/** API message shape (backend may send created_at or timestamp) */
type ApiMessage = Omit<Message, "timestamp"> & {
  created_at?: string;
  timestamp?: string;
  is_read?: boolean;
};

/** Realtime payloads */
type WSIncoming =
  | ChatWSPayload
  | { type: "subscribed"; conversation_id: number | string }
  | {
      type: "read_receipt";
      conversation_id: number | string;
      message_ids: Array<number | string>;
    }
  | { type: "connected"; [key: string]: unknown };

function toMessage(api: ApiMessage): Message {
  return {
    id: api.id,
    conversation_id: api.conversation_id,
    sender_id: api.sender_id,
    content: api.content,
    timestamp: api.created_at ?? api.timestamp ?? new Date().toISOString(),
    is_read: api.is_read ?? false,
  };
}

function sortMessagesByTime(msgs: Message[]): Message[] {
  return [...msgs].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );
}

function sameId(a: number | string | undefined, b: number | string | undefined) {
  return a != null && b != null && String(a) === String(b);
}

export const useConversation = (
  conversationId?: number | string,
  accessToken?: string | null,
  currentUserId?: number | string,
) => {
  const { socket, send } = useChatSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [deliveredMessageIds, setDeliveredMessageIds] = useState<
    Set<number | string>
  >(() => new Set());
  const [readMessageIds, setReadMessageIds] = useState<Set<number | string>>(
    () => new Set(),
  );
  const [loading, setLoading] = useState(true);
  const [subscribed, setSubscribed] = useState(false);
  const loadedConversationId = useRef<number | string | null>(null);

  useEffect(() => {
    if (!socket || conversationId == null) return;

    queueMicrotask(() => setSubscribed(false));

    const doSubscribe = () => {
      void send({ type: "subscribe", conversation_id: conversationId });
    };

    if (socket.connected) {
      doSubscribe();
    } else {
      socket.once("connect", doSubscribe);
    }

    const handler = (data: WSIncoming) => {
      if (
        "conversation_id" in data &&
        data.type !== "connected" &&
        !sameId(data.conversation_id, conversationId)
      ) {
        return;
      }

      if (data.type === "subscribed") {
        setSubscribed(true);
        return;
      }

      if (data.type === "new_message") {
        const msg = (data as ChatWSPayload & { message: Message }).message;
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("chat:new-message", {
              detail: { conversationId, message: msg },
            }),
          );
        }
        setMessages((prev) => {
          if (prev.some((m) => sameId(m.id, msg.id))) return prev;
          return sortMessagesByTime([...prev, msg]);
        });
        return;
      }

      if (data.type === "delivered") {
        const mid = (data as ChatWSPayload & { message_id: number | string })
          .message_id;
        setDeliveredMessageIds((prev) => new Set(prev).add(mid));
        return;
      }

      if (data.type === "read_receipt") {
        const ids = (data as { message_ids: Array<number | string> }).message_ids ?? [];
        if (ids.length > 0) {
          setReadMessageIds((prev) => new Set([...prev, ...ids]));
        }
      }
    };

    socket.on("message", handler);

    return () => {
      socket.off("message", handler);
      socket.off("connect", doSubscribe);
      void send({ type: "unsubscribe", conversation_id: conversationId });
      queueMicrotask(() => setSubscribed(false));
    };
  }, [socket, conversationId, send]);

  useEffect(() => {
    if (!conversationId || !accessToken) {
      queueMicrotask(() => setLoading(false));
      return;
    }
    let cancelled = false;
    queueMicrotask(() => setLoading(true));
    (async () => {
      const res = await chatService.getMessages(conversationId, accessToken);
      if (cancelled) return;
      setLoading(false);
      if (res.status === 200 && Array.isArray(res.data)) {
        loadedConversationId.current = conversationId;
        const apiMessages = res.data as ApiMessage[];
        const msgs = apiMessages.map(toMessage);
        setMessages(sortMessagesByTime(msgs));
        if (currentUserId != null) {
          const readIds = apiMessages
            .filter((m) => sameId(m.sender_id, currentUserId) && m.is_read)
            .map((m) => m.id);
          setReadMessageIds(new Set(readIds));
        }
      } else {
        setMessages([]);
        setReadMessageIds(new Set());
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [conversationId, accessToken, currentUserId]);

  const markAsRead = useCallback(
    (convId: number | string, messageIds: Array<number | string>) => {
      if (messageIds.length === 0) return;
      void send({ type: "read", conversation_id: convId, message_ids: messageIds });
    },
    [send],
  );

  const sendMessage = useCallback(
    async (payload: {
      conversation_id: number | string;
      sender_id: number | string;
      content: string;
    }) => {
      return send({
        type: "message",
        conversation_id: payload.conversation_id,
        content: payload.content,
      });
    },
    [send],
  );

  return {
    messages,
    deliveredMessageIds,
    readMessageIds,
    sendMessage,
    markAsRead,
    loading,
    subscribed,
  };
};
