"use client";

import { PageHero } from "@/components/site/page-hero";
import { Layers } from "lucide-react";

export default function FeaturesHero() {
  return (
    <PageHero
      ariaLabel="Luxestate features"
      icon={Layers}
      title="Platform features"
      description="Everything you need to find, list, and manage properties — search, chat, subscriptions, tickets, and more."
    />
  );
}
