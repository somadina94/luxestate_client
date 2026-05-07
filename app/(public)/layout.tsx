import type { Metadata } from "next";
import GeneralHeader from "@/components/molecules/general-header";
import Footer from "@/components/organisms/footer";

export const metadata: Metadata = {
  title: "Luxestate",
  description:
    "Luxestate is a modern property platform for buying, selling, and managing listings.",
};

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <GeneralHeader />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
