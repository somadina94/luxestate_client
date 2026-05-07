import type { Metadata } from "next";
import LoginVerify from "@/components/templates/login-verify";

export const metadata: Metadata = {
  title: "Verify login",
  description: "Verify your Luxestate login.",
};

export default function VerifyLoginPage() {
  return (
    <div className="min-h-[65vh] border-t border-border/40 bg-gradient-to-b from-muted/25 via-background to-background py-16 md:py-24">
      <LoginVerify />
    </div>
  );
}
