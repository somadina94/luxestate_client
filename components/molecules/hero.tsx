"use client";

import heroBg from "@/assets/hero-bg.jpg";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Compass, Play, Sparkles } from "lucide-react";

export default function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className="relative isolate flex min-h-[min(100dvh,920px)] w-full items-center overflow-hidden px-4 py-20 md:px-12 lg:px-24"
      aria-label="Hero"
    >
      <Image
        src={heroBg}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {/* Light: thin veil so the photo reads; dark: stronger for contrast */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-background/45 via-background/25 to-primary/10 dark:from-background/95 dark:via-background/80 dark:to-primary/20"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_50%_-15%,rgba(200,170,90,0.06),transparent)] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(200,170,90,0.12),transparent)]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto w-full max-w-3xl">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduceMotion ? 0 : 0.65,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="flex flex-col gap-6"
        >
          <p className="inline-flex w-fit items-center gap-2 rounded-full border border-border/60 bg-background/60 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-muted-foreground backdrop-blur-sm md:text-sm">
            <Sparkles className="size-3.5 text-primary" aria-hidden />
            Curated listings · Real-time chat
          </p>
          <h1 className="font-heading text-4xl font-semibold leading-[1.1] tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Discover your next address with{" "}
            <span className="text-gradient-gold">Luxestate</span>
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Search premium properties, message sellers instantly, and manage
            everything in one refined experience — built for clarity and speed.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              asChild
              size="lg"
              className="group gap-2 shadow-lg transition-transform hover:scale-[1.02]"
            >
              <Link href="/properties">
                <Compass className="size-4 transition-transform group-hover:rotate-12" aria-hidden />
                Browse properties
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2 border-border/80 bg-background/50 backdrop-blur-sm">
              <Link href="/about">
                Our story
              </Link>
            </Button>
          </div>

          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Get the app
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="inline-flex h-11 min-w-[140px] items-center justify-center gap-2 rounded-lg border border-border/80 bg-foreground px-4 text-sm font-semibold text-background shadow-sm transition hover:opacity-90"
              aria-label="Download on the App Store (coming soon)"
            >
              <svg
                className="size-6 shrink-0"
                viewBox="0 0 24 24"
                aria-hidden
                fill="currentColor"
              >
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              App Store
            </a>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="inline-flex h-11 min-w-[160px] items-center justify-center gap-2 rounded-lg border border-border/80 bg-background px-4 text-sm font-semibold text-foreground shadow-sm transition hover:bg-muted"
              aria-label="Get it on Google Play (coming soon)"
            >
              <Play className="size-6 shrink-0 text-emerald-600" aria-hidden />
              Google Play
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
