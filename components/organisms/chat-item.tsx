"use client";

import { Conversation } from "@/types";
import { useAppSelector, RootState, AuthState } from "@/store";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useConversation } from "@/hooks/use-conversation";
import { formatMessageTime, trimToLength } from "@/utils/helpers";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatItemProps {
  conversation: Conversation;
  onLastMessageTime?: (conversationId: number | string, timestamp: string) => void;
}

export default function ChatItem({
  conversation,
  onLastMessageTime,
}: ChatItemProps) {
  const router = useRouter();
  const { user, access_token } = useAppSelector(
    (state: RootState) => state.auth,
  ) as AuthState;
  const { messages } = useConversation(conversation.id, access_token, user?.id);
  const lastMessage = messages[messages.length - 1];
  const lastMessageTime = lastMessage?.timestamp;

  useEffect(() => {
    if (
      conversation.id != null &&
      lastMessage?.timestamp &&
      onLastMessageTime
    ) {
      onLastMessageTime(conversation.id, lastMessage.timestamp);
    }
  }, [conversation.id, lastMessage?.timestamp, onLastMessageTime]);

  const isUnreadLastMessage =
    lastMessage && lastMessage.sender_id !== user?.id && !lastMessage.is_read;
  const participantName =
    user?.role === "buyer"
      ? [conversation.agent_first_name, conversation.agent_last_name]
          .filter(Boolean)
          .join(" ") || "Agent"
      : [conversation.user_first_name, conversation.user_last_name]
          .filter(Boolean)
          .join(" ") || "User";

  return (
    <div
      className={cn(
        "relative cursor-pointer rounded-xl border p-4 shadow-sm transition-all duration-200",
        isUnreadLastMessage
          ? "border-primary bg-primary text-primary-foreground shadow-primary/10 hover:bg-primary/90 [&_.muted-copy]:text-white/85"
          : "border-border/80 bg-card text-card-foreground hover:border-primary/30 hover:bg-muted/70 [&_.muted-copy]:text-muted-foreground",
      )}
      onClick={() => {
        if (user?.role === "buyer") {
          router.push(`/buyer-dashboard/messages/${conversation.id}`);
        } else if (user?.role === "seller") {
          router.push(`/seller-dashboard/messages/${conversation.id}`);
        } else if (user?.role === "admin") {
          router.push(`/admin-dashboard/messages/${conversation.id}`);
        }
      }}
    >
      <div className="flex min-w-0 items-start gap-3 pr-20">
        <span
          className={cn(
            "mt-1 flex size-10 shrink-0 items-center justify-center rounded-full",
            isUnreadLastMessage ? "bg-white/15 text-white" : "bg-primary/10 text-primary",
          )}
        >
          <MessageCircle className="size-4" aria-hidden />
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="truncate font-semibold">{participantName}</p>
            {isUnreadLastMessage && (
              <span className="size-2 shrink-0 rounded-full bg-white" aria-label="Unread" />
            )}
          </div>
          <p className="muted-copy truncate text-sm">
            {conversation.property_title || "General conversation"}
          </p>
          <p className="muted-copy line-clamp-2 text-sm">
            {lastMessage?.content
              ? trimToLength(lastMessage.content, 90)
              : "No messages yet"}
          </p>
        </div>
      </div>
      <p className="muted-copy absolute right-4 top-4 text-sm">
        {formatMessageTime(lastMessageTime)}
      </p>
    </div>
  );
}
