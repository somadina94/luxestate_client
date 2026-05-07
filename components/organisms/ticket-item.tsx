"use client";
import { Ticket } from "@/types";
import { useAppSelector, RootState, AuthState } from "@/store";
import { useRouter } from "next/navigation";
import { formatMessageTime } from "@/utils/helpers";
import { LifeBuoy } from "lucide-react";
import { cn } from "@/lib/utils";

interface TicketItemProps {
  ticket: Ticket;
}

export default function TicketItem({ ticket }: TicketItemProps) {
  const router = useRouter();
  const { user } = useAppSelector(
    (state: RootState) => state.auth,
  ) as AuthState;

  let path = `/tickets/${ticket.id}`;
  if (user?.role === "buyer") {
    path = `/buyer-dashboard/tickets/${ticket.id}`;
  } else if (user?.role === "seller") {
    path = `/seller-dashboard/tickets/${ticket.id}`;
  } else if (user?.role === "admin") {
    path = `/admin-dashboard/tickets/${ticket.id}`;
  }
  const isOpenOrInProgress =
    ticket.status === "open" || ticket.status === "in_progress";
  const statusLabel = (ticket.status ?? "open").replace("_", " ");

  return (
    <div
      className={cn(
        "relative flex cursor-pointer items-center justify-between gap-4 rounded-xl border p-4 shadow-sm transition-all duration-200",
        isOpenOrInProgress
          ? "border-primary bg-primary text-primary-foreground shadow-primary/10 hover:bg-primary/90 [&_.muted-copy]:text-white/85"
          : "border-border/80 bg-card text-card-foreground hover:border-primary/30 hover:bg-muted/70 [&_.muted-copy]:text-muted-foreground",
      )}
      onClick={() => router.push(path)}
    >
      <div className="flex min-w-0 items-start gap-3">
        <span
          className={cn(
            "mt-1 flex size-10 shrink-0 items-center justify-center rounded-full",
            isOpenOrInProgress ? "bg-white/15 text-white" : "bg-primary/10 text-primary",
          )}
        >
          <LifeBuoy className="size-4" aria-hidden />
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="truncate font-semibold">{ticket.title}</p>
            {isOpenOrInProgress && (
              <span className="size-2 shrink-0 rounded-full bg-white" aria-label="Open ticket" />
            )}
          </div>
          <p className="muted-copy text-sm capitalize">{statusLabel}</p>
          <p className="muted-copy truncate text-sm">
            {ticket.user?.first_name} {ticket.user?.last_name}
          </p>
        </div>
      </div>
      <p className="muted-copy shrink-0 text-sm">
        {formatMessageTime(ticket.created_at)}
      </p>
    </div>
  );
}
