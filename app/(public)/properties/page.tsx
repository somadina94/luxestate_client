import type { Metadata } from "next";
import AdminProperties from "@/components/templates/admin-properties";

export const metadata: Metadata = {
  title: "Properties",
  description:
    "Browse and filter property listings on Luxestate. Search by location, price, type, and more.",
  openGraph: {
    title: "Browse properties | Luxestate",
    description: "Search and filter premium property listings.",
  },
};

export default function PropertiesPage() {
  return (
    <div className="border-t border-border/40 bg-muted/15">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 lg:px-12">
        <AdminProperties pageTitle="Browse listings" />
      </div>
    </div>
  );
}
