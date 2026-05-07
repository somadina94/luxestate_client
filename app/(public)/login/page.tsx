import type { Metadata } from "next";
import LoginForm from "@/components/templates/login-form";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your Luxestate account.",
};

export default function LoginPage() {
  return (
    <div className="min-h-[65vh] border-t border-border/40 bg-gradient-to-b from-muted/25 via-background to-background py-16 md:py-24">
      <LoginForm />
    </div>
  );
}
