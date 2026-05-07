import type { Metadata } from "next";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import SidebarComponent from "@/components/molecules/sidebar";
import DashboardHeader from "@/components/molecules/dashboard-header";

export const metadata: Metadata = {
  title: {
    default: "Buyer dashboard",
    template: "%s | Buyer | Luxestate",
  },
  description:
    "Your Luxestate buyer workspace — properties, favorites, messages, and notifications.",
};

export default function BuyerDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <SidebarComponent />
      <SidebarInset className="min-h-screen bg-muted/20">
        <DashboardHeader />
        <div className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
