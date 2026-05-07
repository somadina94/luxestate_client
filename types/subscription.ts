export interface Subscription {
  id: number | string;
  name: string;
  user_id: number | string;
  subscription_plan_id: number | string;
  status: SubscriptionStatus;
  start_date: string;
  end_date: string;
  listing_limit: number;
  created_at?: string;
  updated_at?: string;
}

export enum SubscriptionStatus {
  EXPIRED = "expired",
  PAID = "paid",
  CANCELLED = "cancelled",
}
