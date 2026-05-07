import type { Metadata } from "next";
import ForgotPasswordForm from "@/components/templates/forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot password",
  description: "Reset your Luxestate account password.",
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-[65vh] border-t border-border/40 bg-gradient-to-b from-muted/25 via-background to-background py-16 md:py-24">
      <ForgotPasswordForm />
    </div>
  );
}
