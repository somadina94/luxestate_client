"use client";

import { motion, useReducedMotion } from "framer-motion";
import { type LucideIcon } from "lucide-react";

type PageHeroProps = {
  title: string;
  description: string;
  icon?: LucideIcon;
  ariaLabel: string;
};

export function PageHero({ title, description, icon: Icon, ariaLabel }: PageHeroProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className="relative flex min-h-[38vh] w-full items-center justify-center overflow-hidden border-b border-border/60 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-20 md:min-h-[42vh] md:py-28 dark:from-[oklch(0.14_0.03_265)] dark:via-[oklch(0.18_0.04_265)] dark:to-[oklch(0.12_0.02_265)]"
      aria-label={ariaLabel}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_80%_at_50%_-30%,rgba(200,170,90,0.22),transparent)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(105deg,transparent_40%,rgba(255,255,255,0.04)_50%,transparent_60%)]"
        aria-hidden
      />

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mx-auto max-w-3xl text-center"
      >
        {Icon && (
          <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-amber-200/90 backdrop-blur-sm">
            <Icon className="size-7" aria-hidden />
          </div>
        )}
        <h1 className="font-heading text-4xl font-semibold tracking-tight text-white drop-shadow-sm md:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-white/85 md:text-xl">
          {description}
        </p>
      </motion.div>
    </section>
  );
}
