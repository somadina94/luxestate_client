"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export default function AboutCta() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className="border-border/50 border-t bg-gradient-to-b from-background to-muted/25 site-section"
      aria-label="Get started"
    >
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: reduceMotion ? 0 : 0.45 }}
        className="mx-auto flex max-w-2xl flex-col items-center gap-8 text-center"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
          <Sparkles className="size-4" aria-hidden />
          Get started
        </div>
        <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          Ready to find or list your next property?
        </h2>
        <p className="text-muted-foreground">
          Join Luxestate and start browsing listings or create your seller
          account for unlimited postings.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button asChild size="lg" className="min-w-[180px] gap-2 shadow-md">
            <Link href="/properties">
              Browse properties
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="min-w-[160px]">
            <Link href="/sign-up">Sign up</Link>
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
