"use client";
import { useEffect, useMemo, useState } from "react";
import { LayoutDashboard, User, Handshake } from "lucide-react";
import PropertyIcon from "../atoms/PropertyIcon";
import { Progress } from "@/components/ui/progress";
import { ChartPieSimple } from "./pie-chart";
import { authService, propertyService } from "@/services";
import { Property, User as UserType } from "@/types";
import { AuthState, RootState, useAppSelector } from "@/store";
import { toast } from "sonner";
import { ChartBar, type BarChartDataItem } from "./bar-chart";
import { FadeUp } from "@/components/site/motion";
import { cn } from "@/lib/utils";

export default function AdminStats() {
  const [properties, setProperties] = useState<Property[]>();
  const [users, setUsers] = useState<UserType[]>();
  const { access_token } = useAppSelector(
    (state: RootState) => state.auth,
  ) as AuthState;

  useEffect(() => {
    const fetchData = async () => {
      const res = await propertyService.getAllProperties();
      if (res.status === 200) {
        setProperties(res.data);
      } else {
        toast.error(res.message);
      }
    };
    const fetchUsers = async () => {
      const res = await authService.getAllUsers(access_token as string);
      if (res.status === 200) {
        setUsers(res.data);
      } else {
        toast.error(res.message);
      }
    };
    fetchData();
    fetchUsers();
  }, [access_token]);

  const propertiesForSale = properties?.filter(
    (prop) => prop.listing_type === "sell",
  );
  const propertiesForRent = properties?.filter(
    (prop) => prop.listing_type === "rent",
  );

  const pieChartData = [
    {
      item: "SALE",
      value: propertiesForSale?.length.toString() as string,
      color: "#ffd8a8",
    },
    {
      item: "RENT",
      value: propertiesForRent?.length.toString() as string,
      color: "#ffc078",
    },
  ];

  const admins = users?.filter((user) => user.role === "admin");
  const buyers = users?.filter((user) => user.role === "buyer");
  const sellers = users?.filter((user) => user.role === "seller");

  const usersPieChartData = [
    {
      item: "ADMINS",
      value: admins?.length.toString() as string,
      color: "#ffd8a8",
    },
    {
      item: "SELLERS",
      value: sellers?.length.toString() as string,
      color: "#ffc078",
    },
    {
      item: "BUYERS",
      value: buyers?.length.toString() as string,
      color: "#ffa94d",
    },
  ];

  const closedDeals = properties?.filter(
    (prop) => prop.status === "sold" || prop.status === "rented",
  );

  const rentedProperties = closedDeals?.filter(
    (prop) => prop.status === "rented",
  );

  const soldProperties = closedDeals?.filter((prop) => prop.status === "sold");

  const closedDealsPieChartData = [
    {
      item: "RENTED",
      value: rentedProperties?.length.toString() as string,
      color: "#ffc078",
    },
    {
      item: "SOLD",
      value: soldProperties?.length.toString() as string,
      color: "#ffa94d",
    },
  ];

  const barChartData = useMemo((): BarChartDataItem[] => {
    const currentYear = new Date().getFullYear();
    const months: BarChartDataItem[] = [];

    for (let month = 0; month < 12; month++) {
      const date = new Date(currentYear, month, 1);
      const nextMonth = new Date(currentYear, month + 1, 1);

      const inMonth = (createdAt: string | Date | undefined) => {
        if (!createdAt) return false;
        const d =
          typeof createdAt === "string" ? new Date(createdAt) : createdAt;
        return d >= date && d < nextMonth;
      };

      const Rent = (properties ?? []).filter(
        (p) =>
          (p.listing_type === "rent" || p.listing_type === "lease") &&
          inMonth(p.created_at),
      ).length;
      const Sell = (properties ?? []).filter(
        (p) => p.listing_type === "sell" && inMonth(p.created_at),
      ).length;

      months.push({ month: date, Rent, Sell });
    }
    return months;
  }, [properties]);

  const statCardClass =
    "mb-4 flex w-full max-w-xl items-center justify-between gap-4 rounded-xl border border-border/80 bg-card p-4 shadow-sm";

  return (
    <div className="flex flex-col gap-8">
      <FadeUp>
        <div className="flex items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <LayoutDashboard className="size-5" aria-hidden />
          </span>
          <div>
            <h1 className="font-heading text-2xl font-semibold tracking-tight md:text-3xl">
              Platform overview
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Listings, users, and deal activity at a glance.
            </p>
          </div>
        </div>
      </FadeUp>

      <div className="flex flex-col items-stretch gap-6 xl:flex-row xl:items-start">
        <div className="flex w-full flex-col items-center">
          <div className={cn(statCardClass)}>
            <PropertyIcon className="size-8 shrink-0 text-primary" />
            <div className="flex min-w-0 flex-1 flex-col items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                Total properties
              </span>
              <Progress
                value={100}
                className="h-2 w-full max-w-[240px] **:data-[slot=progress]:bg-muted **:data-[slot=progress-indicator]:bg-primary"
              />
            </div>
            <span className="font-heading text-2xl font-semibold tabular-nums text-foreground">
              {properties?.length ?? "—"}
            </span>
          </div>
          <ChartPieSimple
            data={pieChartData}
            title="Properties available"
            description={new Date().toLocaleDateString()}
            footerText="Displaying property data insights"
          />
        </div>
        <div className="flex w-full flex-col items-center">
          <div className={cn(statCardClass)}>
            <Handshake className="size-8 shrink-0 text-primary" aria-hidden />
            <div className="flex min-w-0 flex-1 flex-col items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                Closed deals
              </span>
              <Progress
                value={100}
                className="h-2 w-full max-w-[240px] **:data-[slot=progress]:bg-muted **:data-[slot=progress-indicator]:bg-primary"
              />
            </div>
            <span className="font-heading text-2xl font-semibold tabular-nums text-foreground">
              {closedDeals?.length ?? "—"}
            </span>
          </div>
          <ChartPieSimple
            data={closedDealsPieChartData}
            title="Closed deals"
            description={new Date().toLocaleDateString()}
            footerText="Displaying property sold and rented"
          />
        </div>
        <div className="flex w-full flex-col items-center">
          <div className={cn(statCardClass)}>
            <User className="size-8 shrink-0 text-primary" aria-hidden />
            <div className="flex min-w-0 flex-1 flex-col items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                Total users
              </span>
              <Progress
                value={100}
                className="h-2 w-full max-w-[240px] **:data-[slot=progress]:bg-muted **:data-[slot=progress-indicator]:bg-primary"
              />
            </div>
            <span className="font-heading text-2xl font-semibold tabular-nums text-foreground">
              {users?.length ?? "—"}
            </span>
          </div>

          <ChartPieSimple
            data={usersPieChartData}
            title="All users"
            description={new Date().toLocaleDateString()}
            footerText="Displaying user's data insights"
          />
        </div>
      </div>
      <ChartBar
        data={barChartData}
        title="Properties listings by month"
        description={`Rent vs Sell created in ${new Date().getFullYear()}`}
        rentColor={pieChartData.find((d) => d.item === "RENT")?.color}
        sellColor={pieChartData.find((d) => d.item === "SALE")?.color}
        className="rounded-xl border border-border/80 bg-card p-4 shadow-sm"
      />
    </div>
  );
}
