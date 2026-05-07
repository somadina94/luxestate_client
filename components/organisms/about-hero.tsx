"use client";

import { PageHero } from "@/components/site/page-hero";
import { Building2 } from "lucide-react";

export default function AboutHero() {
  return (
    <PageHero
      ariaLabel="About Luxestate"
      icon={Building2}
      title="About Luxestate"
      description="The modern property platform built for buyers, sellers, and admins. Search, chat, list, and manage — all in one place."
    />
  );
}
