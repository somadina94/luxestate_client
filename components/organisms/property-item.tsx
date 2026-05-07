"use client";

import { useAppSelector, AuthState, RootState } from "@/store";
import { Property } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/utils/helpers";
import { motion, useReducedMotion } from "framer-motion";
import {
  Building2,
  CalendarDays,
  Gem,
  MapPin,
  Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface propertyItemProps {
  property: Property;
}

export default function PropertyItem({ property }: propertyItemProps) {
  const { user } = useAppSelector(
    (state: RootState) => state.auth,
  ) as AuthState;
  const reduceMotion = useReducedMotion();

  let path = `/properties/${property.id}`;

  if (user?.role === "buyer") {
    path = `/buyer-dashboard/properties/${property.id}`;
  } else if (user?.role === "seller") {
    path = `/seller-dashboard/properties/${property.id}`;
  } else if (user?.role === "admin") {
    path = `/admin-dashboard/properties/${property.id}`;
  }

  const listingLabel = (property.listing_type ?? "").toUpperCase() || "—";

  return (
    <motion.div
      className="h-full w-full min-w-0"
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: reduceMotion ? 0 : 0.35 }}
    >
      <Link
        href={path}
        className={cn(
          "group flex h-full w-full min-w-0 flex-col overflow-hidden rounded-xl border border-border/80 bg-card text-card-foreground shadow-sm transition-all",
          "hover:border-primary/35 hover:shadow-lg hover:shadow-primary/5",
        )}
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
          <Image
            src={
              property.overview_image && property.overview_image.length >= 10
                ? property.overview_image
                : "https://images.unsplash.com/photo-1760434875920-2b7a79ea163a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }
            alt={property.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
          <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary backdrop-blur-sm">
            <Tag className="size-3.5" aria-hidden />
            {listingLabel}
          </div>
        </div>

        <div className="flex flex-1 flex-col p-4">
          <div className="flex min-h-[4.25rem] items-start justify-between gap-2 border-b border-border/60 pb-3">
            <h3 className="line-clamp-2 min-h-[3.25rem] font-heading text-lg font-semibold leading-snug text-foreground group-hover:text-primary">
              {property.title}
            </h3>
            <Gem className="mt-0.5 size-4 shrink-0 text-primary/70 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
          </div>

          <p className="flex min-h-[3.5rem] items-center border-b border-border/60 py-3 text-xl font-semibold tabular-nums text-primary">
            {property.currency}{" "}
            {typeof property.price === "number"
              ? property.price.toLocaleString()
              : property.price}
          </p>

          <div className="grid min-h-[4rem] grid-cols-2 gap-3 border-b border-border/60 py-3 text-sm text-muted-foreground">
            <span className="inline-flex min-w-0 items-center gap-1.5">
              <Building2 className="size-3.5 shrink-0" aria-hidden />
              <span className="truncate">Built {property.year_built}</span>
            </span>
            <span className="inline-flex min-w-0 items-center gap-1.5">
              <CalendarDays className="size-3.5 shrink-0" aria-hidden />
              <span className="truncate">{formatDate(property.created_at)}</span>
            </span>
          </div>

          <p className="flex min-h-[3.75rem] items-start gap-2 pt-3 text-sm leading-relaxed text-muted-foreground">
            <MapPin className="mt-0.5 size-4 shrink-0 text-primary/80" aria-hidden />
            <span className="line-clamp-2">
              {property?.address}, {property?.city}, {property?.state}{" "}
              {property?.zip_code}, {property?.country}
            </span>
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
