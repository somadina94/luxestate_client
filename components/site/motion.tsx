"use client";

import * as React from "react";
import {
  motion,
  useReducedMotion,
  type HTMLMotionProps,
  type Variants,
} from "framer-motion";
import { cn } from "@/lib/utils";
import {
  fadeUpVariants,
  staggerContainer,
  staggerItem,
} from "@/lib/site-motion";

type DivProps = HTMLMotionProps<"div">;

type FadeUpProps = Omit<HTMLMotionProps<"div">, "children"> & {
  children: React.ReactNode;
  delay?: number;
};

export function FadeUp({
  className,
  children,
  delay = 0,
  ...props
}: FadeUpProps) {
  const reduce = useReducedMotion();
  if (reduce) {
    return <div className={cn(className)}>{children}</div>;
  }
  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={fadeUpVariants}
      transition={{ delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({
  className,
  children,
  variants,
}: {
  className?: string;
  children: React.ReactNode;
  variants?: Variants;
}) {
  const reduce = useReducedMotion();
  if (reduce) {
    return <div className={cn(className)}>{children}</div>;
  }
  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={variants ?? staggerContainer}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  if (reduce) {
    return <div className={cn(className)}>{children}</div>;
  }
  return (
    <motion.div className={cn(className)} variants={staggerItem}>
      {children}
    </motion.div>
  );
}

export function MotionDiv({
  className,
  children,
  ...props
}: Omit<HTMLMotionProps<"div">, "children"> & { children: React.ReactNode }) {
  return (
    <motion.div className={cn(className)} {...props}>
      {children}
    </motion.div>
  );
}
