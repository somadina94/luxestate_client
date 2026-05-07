"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  Building2,
  HelpCircle,
  Home,
  Mail,
  MapPin,
  Shield,
  Sparkles,
} from "lucide-react";

const year = new Date().getFullYear();

const columns = [
  {
    title: "Explore",
    icon: Home,
    links: [
      { href: "/", label: "Home" },
      { href: "/properties", label: "Browse listings" },
      { href: "/features", label: "Features" },
      { href: "/about", label: "About us" },
    ],
  },
  {
    title: "Listings",
    icon: Sparkles,
    links: [
      { href: "/properties", label: "All listings" },
      { href: "/sign-up", label: "List your property" },
      { href: "/login", label: "Sign in to manage" },
    ],
  },
  {
    title: "Account",
    icon: Shield,
    links: [
      { href: "/login", label: "Sign in" },
      { href: "/sign-up", label: "Sign up" },
      { href: "/forgot-password", label: "Forgot password" },
    ],
  },
  {
    title: "Support",
    icon: HelpCircle,
    links: [
      { href: "/features", label: "How it works" },
      { href: "/about", label: "Our story" },
    ],
  },
] as const;

export default function Footer() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.footer
      initial={reduceMotion ? false : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: reduceMotion ? 0 : 0.5 }}
      className="mt-auto border-t border-border/80 bg-muted/40"
    >
      <div className="site-section mx-auto max-w-7xl">
        <div className="grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-5 lg:gap-8">
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-heading text-xl font-semibold tracking-tight text-foreground"
            >
              <Building2 className="size-8 text-primary" aria-hidden />
              Luxestate
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              A refined platform to discover listings, connect with agents, and
              manage properties — built for clarity, speed, and trust.
            </p>
            <div className="mt-6 flex flex-col gap-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <MapPin className="size-4 shrink-0 text-primary/80" aria-hidden />
                Serving buyers & sellers worldwide
              </span>
              <span className="inline-flex items-center gap-2">
                <Mail className="size-4 shrink-0 text-primary/80" aria-hidden />
                <a
                  href="mailto:support@luxestate.app"
                  className="hover:text-foreground"
                >
                  support@luxestate.app
                </a>
              </span>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h2 className="mb-4 flex items-center gap-2 font-heading text-sm font-semibold uppercase tracking-wider text-foreground">
                <col.icon className="size-4 text-primary" aria-hidden />
                {col.title}
              </h2>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 border-t border-border/60 py-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            © {year} Luxestate. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <Link
              href="/features"
              className="text-muted-foreground hover:text-foreground"
            >
              Privacy & terms
            </Link>
            <Link
              href="/about"
              className="text-muted-foreground hover:text-foreground"
            >
              Company
            </Link>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
