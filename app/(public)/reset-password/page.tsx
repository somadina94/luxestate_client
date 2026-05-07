import type { Metadata } from "next";
import ResetPasswordForm from "@/components/templates/reset-password-form";

export const metadata: Metadata = {
  title: "Reset password",
  description: "Set a new password for your Luxestate account.",
};

export default function ResetPasswordPage() {
  return (
    <div className="min-h-[65vh] border-t border-border/40 bg-gradient-to-b from-muted/25 via-background to-background py-16 md:py-24">
      <ResetPasswordForm />
    </div>
  );
}
