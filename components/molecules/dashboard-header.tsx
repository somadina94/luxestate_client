"use client";

import { useAppSelector, RootState, AuthState } from "@/store";
import { useUnreadCount } from "@/hooks/use-unread-count";
import { useUnreadNotificationCount } from "@/hooks/use-unread-notification-count";
import { useNotificationContext } from "@/context/notification-provider";
import { useRouter } from "next/navigation";
import {
  MessageCircle,
  Bell,
  Ticket,
  User,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { useOpenTicketCount } from "@/hooks/use-open-ticket-count";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { SiteThemeToggle } from "@/components/site/theme-toggle";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

function roleLabel(role: string | undefined) {
  if (!role) return "";
  return role.charAt(0).toUpperCase() + role.slice(1);
}

export default function DashboardHeader() {
  const router = useRouter();
  const { user, access_token } = useAppSelector(
    (state: RootState) => state.auth,
  ) as AuthState;
  const { unreadCount } = useUnreadCount(access_token ?? null);
  const { unreadCount: unreadNotificationCount } = useUnreadNotificationCount(
    access_token ?? null,
  );
  const { openCount: openTicketCount } = useOpenTicketCount(
    access_token ?? null,
  );
  const { requestPermissionAndSubscribe } = useNotificationContext();

  let messagesPath = "/buyer-dashboard/messages";
  let notificationsPath = "/buyer-dashboard/notifications";
  let ticketsPath = "/buyer-dashboard/tickets";
  let settingsPath = "/buyer-dashboard/settings";

  if (user?.role === "buyer") {
    messagesPath = "/buyer-dashboard/messages";
    notificationsPath = "/buyer-dashboard/notifications";
    ticketsPath = "/buyer-dashboard/tickets";
    settingsPath = "/buyer-dashboard/settings";
  } else if (user?.role === "seller") {
    messagesPath = "/seller-dashboard/messages";
    notificationsPath = "/seller-dashboard/notifications";
    ticketsPath = "/seller-dashboard/tickets";
    settingsPath = "/seller-dashboard/settings";
  } else if (user?.role === "admin") {
    messagesPath = "/admin-dashboard/messages";
    notificationsPath = "/admin-dashboard/notifications";
    ticketsPath = "/admin-dashboard/tickets";
    settingsPath = "/admin-dashboard/settings";
  }

  const handleBellClick = () => {
    requestPermissionAndSubscribe();
    router.push(notificationsPath);
  };

  const displayName =
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") || "Account";

  const initials = `${user?.first_name?.[0] ?? ""}${user?.last_name?.[0] ?? ""}`.trim() || "?";

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-border/80 bg-background/90 px-3 backdrop-blur-md supports-[backdrop-filter]:bg-background/75 md:gap-4 md:px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1 shrink-0 text-foreground" />
        <Separator orientation="vertical" className="hidden h-8 md:block" />
        <span className="hidden font-heading text-lg font-semibold tracking-tight text-foreground md:inline">
          Dashboard
        </span>
      </div>

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        <Link
          href={messagesPath}
          className={cn(
            "relative flex size-10 items-center justify-center rounded-xl border border-border/60 bg-muted/50 text-muted-foreground transition-colors hover:border-primary/30 hover:bg-primary/10 hover:text-primary",
          )}
          aria-label="Messages"
        >
          <MessageCircle className="size-[18px] md:size-5" aria-hidden />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Link>

        <button
          type="button"
          onClick={handleBellClick}
          className="relative flex size-10 items-center justify-center rounded-xl border border-border/60 bg-muted/50 text-muted-foreground transition-colors hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
          aria-label="Notifications"
        >
          <Bell className="size-[18px] md:size-5" aria-hidden />
          {unreadNotificationCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-white">
              {unreadNotificationCount > 99 ? "99+" : unreadNotificationCount}
            </span>
          )}
        </button>

        <Link
          href={ticketsPath}
          className="relative flex size-10 items-center justify-center rounded-xl border border-border/60 bg-muted/50 text-muted-foreground transition-colors hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
          aria-label="Support tickets"
        >
          <Ticket className="size-[18px] md:size-5" aria-hidden />
          {openTicketCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-amber-600 px-1 text-[10px] font-semibold text-white dark:bg-amber-500">
              {openTicketCount > 99 ? "99+" : openTicketCount}
            </span>
          )}
        </Link>

        <Separator orientation="vertical" className="mx-1 hidden h-8 sm:block" />

        <SiteThemeToggle />

        <Separator orientation="vertical" className="mx-1 hidden h-8 md:block" />

        <div className="hidden items-center gap-3 sm:flex">
          <div className="text-right leading-tight">
            <p className="max-w-[140px] truncate text-sm font-medium text-foreground">
              {displayName}
            </p>
            <p className="text-xs capitalize text-muted-foreground">
              {roleLabel(user?.role)}
            </p>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="size-10 shrink-0 rounded-xl border-border/60"
            asChild
          >
            <Link href={settingsPath} aria-label="Settings">
              <Settings className="size-4" />
            </Link>
          </Button>
          <div
            className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 font-heading text-sm font-semibold text-primary"
            aria-hidden
          >
            {initials}
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="size-10 rounded-xl sm:hidden"
          asChild
        >
          <Link href={settingsPath} aria-label="Settings">
            <User className="size-5" />
          </Link>
        </Button>
      </div>
    </header>
  );
}
