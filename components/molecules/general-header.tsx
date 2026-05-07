"use client";

import { useAppSelector, RootState, AuthState } from "@/store";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { SiteThemeToggle } from "@/components/site/theme-toggle";
import { motion, useReducedMotion } from "framer-motion";
import {
  Building2,
  Info,
  LayoutDashboard,
  Layers,
  LogIn,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/properties", label: "Properties", icon: Search },
  { href: "/features", label: "Features", icon: Layers },
  { href: "/about", label: "About", icon: Info },
] as const;

export default function GeneralHeader() {
  const { isLoggedIn, user } = useAppSelector(
    (state: RootState) => state.auth,
  ) as AuthState;
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  let dashboardPath = "/login";
  if (isLoggedIn && user?.role === "admin") {
    dashboardPath = "/admin-dashboard";
  } else if (isLoggedIn && user?.role === "buyer") {
    dashboardPath = "/buyer-dashboard";
  } else if (isLoggedIn && user?.role === "seller") {
    dashboardPath = "/seller-dashboard";
  }

  return (
    <motion.header
      initial={reduceMotion ? false : { y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: reduceMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/70"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2 font-heading text-xl font-semibold tracking-tight text-foreground transition-colors hover:text-primary sm:text-2xl"
        >
          <Building2
            className="size-7 text-primary transition-transform group-hover:scale-105"
            aria-hidden
          />
          <span className="hidden sm:inline">Luxestate</span>
          <span className="sm:hidden">LE</span>
        </Link>

        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label="Primary"
        >
          {NAV.map(({ href, label, icon: Icon }) => {
            const active =
              pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="size-4 shrink-0 opacity-80" aria-hidden />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <SiteThemeToggle />
          {isLoggedIn ? (
            <Button asChild size="sm" className="gap-2 shadow-sm">
              <Link href={dashboardPath}>
                <LayoutDashboard className="size-4" aria-hidden />
                <span className="hidden sm:inline">Dashboard</span>
                <span className="sm:hidden">Home</span>
              </Link>
            </Button>
          ) : (
            <Button asChild size="sm" className="gap-2 shadow-sm">
              <Link href="/login">
                <LogIn className="size-4" aria-hidden />
                <span className="hidden sm:inline">Sign in</span>
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Mobile nav */}
      <nav
        className="flex border-t border-border/60 bg-muted/30 px-2 py-2 md:hidden"
        aria-label="Mobile primary"
      >
        <div className="flex w-full justify-around gap-1">
          {NAV.map(({ href, label, icon: Icon }) => {
            const activeMobile =
              pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex flex-1 flex-col items-center gap-0.5 rounded-md px-2 py-1.5 text-[11px] font-medium",
                  activeMobile
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="size-4" aria-hidden />
                {label}
              </Link>
            );
          })}
        </div>
      </nav>
    </motion.header>
  );
}
