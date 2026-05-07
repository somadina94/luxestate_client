"use client";

import { type LucideIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";

export interface AboutFeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

export default function AboutFeatureCard({
  icon: Icon,
  title,
  description,
  className,
}: AboutFeatureCardProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      whileHover={
        reduceMotion
          ? undefined
          : { y: -4, transition: { duration: 0.2 } }
      }
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
    >
      <Card
        className={cn(
          "h-full border-border/80 bg-card/90 backdrop-blur-sm transition-shadow hover:border-primary/25 hover:shadow-lg hover:shadow-primary/5",
          className,
        )}
      >
        <CardHeader>
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary/12 text-primary ring-1 ring-primary/15">
            <Icon className="size-6" aria-hidden />
          </div>
          <CardTitle className="font-heading text-lg">{title}</CardTitle>
          <CardDescription className="leading-relaxed text-muted-foreground">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0" />
      </Card>
    </motion.div>
  );
}
