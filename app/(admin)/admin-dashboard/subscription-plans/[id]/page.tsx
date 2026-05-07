"use client";

import { useParams } from "next/navigation";
import UpdateSubscriptionPlanForm from "@/components/organisms/update-subscription-plan-form";

export default function UpdateSubscriptionPlanPage() {
  const params = useParams();
  const id = (Array.isArray(params?.id) ? params.id[0] : params?.id) ?? "";
  if (!id) {
    return (
      <div className="p-4 text-destructive">Invalid subscription plan ID.</div>
    );
  }
  return (
    <div className="p-4">
      <UpdateSubscriptionPlanForm subscriptionPlanId={id} />
    </div>
  );
}
