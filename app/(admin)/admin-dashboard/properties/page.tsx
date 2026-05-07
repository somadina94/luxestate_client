import type { Metadata } from "next";
import AdminProperties from "@/components/templates/admin-properties";

export const metadata: Metadata = {
  title: "Properties",
  description: "Manage all properties on Luxestate.",
};

export default function PropertiesPage() {
  return (
    <div className="mx-auto w-full max-w-7xl">
      <AdminProperties pageTitle="Manage properties" />
    </div>
  );
}
