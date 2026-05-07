"use client";

import { useAppSelector, RootState, AuthState } from "@/store";
import { Notification } from "@/types";
import { trimToLength, formatMessageTime } from "@/utils/helpers";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";

interface NotificationItemProps {
  notification: Notification;
}

export default function NotificationItem({
  notification,
}: NotificationItemProps) {
  const { user } = useAppSelector(
    (state: RootState) => state.auth,
  ) as AuthState;
  const router = useRouter();

  let path = "/notifications";
  if (user?.role === "buyer") {
    path = `/buyer-dashboard/notifications/${notification.id}`;
  } else if (user?.role === "seller") {
    path = `/seller-dashboard/notifications/${notification.id}`;
  } else if (user?.role === "admin") {
    path = `/admin-dashboard/notifications/${notification.id}`;
  }

  const isUnread = !notification.is_read;

  return (
    <div
      onClick={() => {
        router.push(path);
      }}
      className={cn(
        "mx-auto flex w-full max-w-5xl cursor-pointer items-center justify-between gap-4 rounded-xl border p-4 shadow-sm transition-all duration-200",
        isUnread
          ? "border-primary bg-primary text-primary-foreground shadow-primary/10 hover:bg-primary/90 [&_.muted-copy]:text-white/85"
          : "border-border/80 bg-card text-card-foreground hover:border-primary/30 hover:bg-muted/70 [&_.muted-copy]:text-muted-foreground",
      )}
    >
      <div className="flex min-w-0 items-start gap-3">
        <span
          className={cn(
            "mt-1 flex size-9 shrink-0 items-center justify-center rounded-full",
            isUnread ? "bg-white/15 text-white" : "bg-primary/10 text-primary",
          )}
        >
          <Bell className="size-4" aria-hidden />
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-base font-semibold">{notification.title}</h3>
            {isUnread && (
              <span className="size-2 shrink-0 rounded-full bg-white" aria-label="Unread" />
            )}
          </div>
          <p className="muted-copy line-clamp-2 text-sm">
            {trimToLength(notification.body, 90)}
          </p>
        </div>
      </div>
      <p className="muted-copy shrink-0 text-sm">
        {formatMessageTime(notification.created_at)}
      </p>
    </div>
  );
}
