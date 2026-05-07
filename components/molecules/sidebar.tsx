"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  ADMIN_MENU_ITEMS,
  BUYER_MENU_ITEMS,
  SELLER_MENU_ITEMS,
  MenuItem,
} from "@/constants/menu-items";
import Link from "next/link";
import { useAppSelector, RootState, AuthState } from "@/store";
import { useRouter } from "next/navigation";
import { Building2, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import { useLogout } from "@/hooks/use-logout";
import { useUnreadCount } from "@/hooks/use-unread-count";
import { useUnreadNotificationCount } from "@/hooks/use-unread-notification-count";
import { useOpenTicketCount } from "@/hooks/use-open-ticket-count";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function SidebarComponent() {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useLogout();
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

  let menuItems: MenuItem[] = [];
  if (user?.role === "admin") {
    menuItems = ADMIN_MENU_ITEMS;
  } else if (user?.role === "buyer") {
    menuItems = BUYER_MENU_ITEMS;
  } else if (user?.role === "seller") {
    menuItems = SELLER_MENU_ITEMS;
  }

  const roleBadge =
    user?.role === "admin"
      ? "Admin"
      : user?.role === "seller"
        ? "Seller"
        : user?.role === "buyer"
          ? "Buyer"
          : "";

  return (
    <Sidebar collapsible="icon" className="border-r border-border/80">
      <SidebarHeader className="gap-3 border-b border-border/60 px-3 py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              tooltip="Luxestate · Home"
            >
              <Link
                href="/"
                className="flex items-center gap-3 font-heading text-lg font-semibold tracking-tight text-foreground hover:text-primary"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:rounded-lg">
                  <Building2
                    className="size-5 shrink-0 group-data-[collapsible=icon]:size-4"
                    aria-hidden
                  />
                </span>
                <span className="truncate">Luxestate</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        {roleBadge ? (
          <p className="px-1 text-xs font-medium uppercase tracking-wider text-muted-foreground group-data-[collapsible=icon]:hidden">
            {roleBadge} workspace
          </p>
        ) : null}
      </SidebarHeader>

      <SidebarContent className="gap-0 px-2 py-3">
        <SidebarMenu className="gap-1">
          {menuItems.map((item) => {
            const isActive =
              pathname === item.url || pathname.startsWith(`${item.url}/`);
            const messageCount =
              item.title === "Messages" ? unreadCount : undefined;
            const notificationCount =
              item.title === "Notifications"
                ? unreadNotificationCount
                : undefined;
            const ticketCount =
              item.title === "Tickets" ? openTicketCount : undefined;
            const badgeCount =
              messageCount ?? notificationCount ?? ticketCount ?? 0;

            return (
              <SidebarMenuItem key={item.title} className="relative">
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  isActive={isActive}
                  className={cn(
                    "rounded-lg transition-colors",
                    isActive &&
                      "bg-primary/12 font-medium text-primary hover:bg-primary/15 hover:text-primary",
                  )}
                >
                  <Link href={item.url} className="gap-3">
                    <item.icon
                      className={cn(
                        "size-4 shrink-0",
                        isActive ? "text-primary" : "text-muted-foreground",
                      )}
                      aria-hidden
                    />
                    <span className="truncate">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
                {badgeCount > 0 && (
                  <SidebarMenuBadge
                    className={cn(
                      "rounded-full border-0 bg-destructive text-[10px] font-semibold text-white",
                      item.title === "Tickets" &&
                        "bg-amber-600 text-white dark:bg-amber-500",
                    )}
                  >
                    {badgeCount > 99 ? "99+" : badgeCount}
                  </SidebarMenuBadge>
                )}
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/60 p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Sign out"
              className="w-full justify-start gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive data-[active=true]:text-destructive"
              onClick={() => {
                router.push("/");
                setTimeout(() => {
                  logout();
                  toast.success("Logged out successfully");
                }, 300);
              }}
            >
              <LogOut className="size-4 shrink-0" aria-hidden />
              <span>Sign out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
