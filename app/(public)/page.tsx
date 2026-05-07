import type { Metadata } from "next";
import Hero from "@/components/molecules/hero";
import Featured from "@/components/organisms/featured";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Luxestate — discover curated property listings. Browse featured homes, connect with sellers, and manage everything in one refined platform.",
  openGraph: {
    title: "Luxestate — Luxury real estate listings",
    description:
      "Discover curated listings, realtime chat, and tools for buyers and sellers.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Luxestate",
  description:
    "Modern property platform for buyers, sellers, and administrators.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/properties`,
    },
    "query-input": "required name=search_term_string",
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <Featured />
    </>
  );
}
