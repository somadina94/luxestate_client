"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { propertyService, SearchPropertiesParams } from "@/services";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Property } from "@/types";
import { toast } from "sonner";
import { Button } from "../ui/button";
import Loading from "../atoms/loading";
import PropertyItem from "./property-item";
import { cn } from "@/lib/utils";
import { FadeUp, Stagger, StaggerItem } from "@/components/site/motion";

export default function Featured() {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(6);

  const params: SearchPropertiesParams = useMemo(
    () => ({
      is_featured: true,
      skip: (currentPage - 1) * limit,
      limit,
    }),
    [currentPage, limit],
  );

  const { data: properties = [], isLoading: loading } = useQuery({
    queryKey: ["properties", "featured", params],
    queryFn: async (): Promise<Property[]> => {
      const res = await propertyService.searchProperties(params);
      if (res.status === 200) {
        if (Array.isArray(res.data)) return res.data;
        if (res.data && typeof res.data === "object" && "items" in res.data) {
          return (res.data as { items: Property[] }).items ?? [];
        }
        return [];
      }
      toast.error(res.message || "Failed to fetch properties");
      return [];
    },
  });

  const hasMorePages = properties.length === limit;
  const estimatedTotalPages = hasMorePages ? currentPage + 1 : currentPage;

  return (
    <section
      className="relative border-t border-border/60 bg-muted/20 py-20 md:py-28"
      aria-labelledby="featured-heading"
    >
      <div className="site-section relative mx-auto max-w-7xl">
        <FadeUp className="mb-12 text-center">
          <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <Star className="size-4 fill-primary/30" aria-hidden />
            Hand-picked for you
          </div>
          <h2
            id="featured-heading"
            className="font-heading text-3xl font-semibold tracking-tight md:text-4xl"
          >
            Featured properties
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Standout listings chosen for quality, location, and presentation.
          </p>
        </FadeUp>

        {loading ? (
          <Loading />
        ) : properties.length > 0 ? (
          <Stagger className="grid grid-cols-1 justify-items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <StaggerItem key={property.id} className="h-full w-full min-w-0">
                <PropertyItem property={property} />
              </StaggerItem>
            ))}
          </Stagger>
        ) : (
          <p className="py-12 text-center text-muted-foreground">
            No featured properties yet. Check back soon.
          </p>
        )}

        {(currentPage > 1 || hasMorePages) && (
          <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1 || loading}
              className="gap-1"
            >
              <ChevronLeft className="size-4" aria-hidden />
              Previous
            </Button>
            <div className="flex flex-wrap items-center justify-center gap-1">
              {Array.from(
                { length: Math.min(5, estimatedTotalPages) },
                (_, i) => {
                  let pageNum: number;
                  if (estimatedTotalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= estimatedTotalPages - 2) {
                    pageNum = estimatedTotalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  if (pageNum > estimatedTotalPages) return null;
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      disabled={loading}
                      className={cn(
                        "min-w-10",
                        currentPage === pageNum && "ring-2 ring-primary/30",
                      )}
                    >
                      {pageNum}
                    </Button>
                  );
                },
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={!hasMorePages || loading}
              className="gap-1"
            >
              Next
              <ChevronRight className="size-4" aria-hidden />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
