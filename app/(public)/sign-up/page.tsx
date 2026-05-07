import type { Metadata } from "next";
import SignupForm from "@/components/templates/sign-up-form";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Create a Luxestate account to browse, list, or manage properties.",
};

export default function SignupPage() {
  return (
    <div className="min-h-[65vh] border-t border-border/40 bg-gradient-to-b from-muted/25 via-background to-background py-16 md:py-24">
      <SignupForm />
    </div>
  );
}
