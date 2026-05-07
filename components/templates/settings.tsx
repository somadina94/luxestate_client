"use client";
import { useState } from "react";
import { useAppSelector, RootState, AuthState } from "@/store";
import SettingsItem from "../organisms/settings-item";
import { BellRing, CreditCard, User, Lock, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import IconButton from "../atoms/IconButton";
import { toast } from "sonner";
import { authService } from "@/services";
import { useLogout } from "@/hooks/use-logout";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { useNotificationContext } from "@/context/notification-provider";

export default function Settings() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { user, access_token } = useAppSelector(
    (state: RootState) => state.auth,
  ) as AuthState;
  const logout = useLogout();
  const { requestPermissionAndSubscribe } = useNotificationContext();

  const handleSubscribePush = async () => {
    console.info("Push notification settings action clicked");
    if (typeof window === "undefined" || !("Notification" in window)) {
      toast.error("Push notifications are not supported in this browser");
      return;
    }
    const subscribed = await requestPermissionAndSubscribe();
    if (subscribed) {
      toast.success("Push notifications are enabled");
    } else if (Notification.permission === "denied") {
      toast.error("Notifications are blocked. Enable them in your browser settings.");
    } else {
      toast.error("Could not subscribe to push notifications. Please try again.");
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    const response = await authService.deactivateUser(access_token as string);
    if (response.status === 200) {
      toast.success("Account deleted successfully");
      logout();
      router.push("/");
    } else {
      toast.error(response.message as string);
    }
    setLoading(false);
  };
  return (
    <div className="flex flex-col gap-4 mx-auto max-w-2xl">
      <SettingsItem
        title="My Details"
        description="Manage your profile"
        Icon={User}
        onClick={() => {
          router.push(`/${user?.role}-dashboard/settings/my-details`);
        }}
      />
      <SettingsItem
        title="Update Password"
        description="Manage your password"
        Icon={Lock}
        onClick={() => {
          router.push(`/${user?.role}-dashboard/settings/update-password`);
        }}
      />
      <button
        type="button"
        className="flex w-full cursor-pointer flex-row items-center justify-start gap-4 rounded-lg bg-primary/20 p-4 text-left shadow-sm transition-colors hover:bg-primary/50"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          void handleSubscribePush();
        }}
      >
        <BellRing className="h-8 w-8 shrink-0 text-gray-500" />
        <div className="flex flex-col">
          <h1 className="text-lg font-bold">Push Notifications</h1>
          <p className="text-sm text-gray-500">
            Subscribe to browser push notifications
          </p>
        </div>
      </button>
      {user?.role === "seller" && (
        <SettingsItem
          title="Subscription"
          description="Manage your subscription"
          Icon={CreditCard}
          onClick={() => {
            console.info("Subscription settings action clicked");
            router.push("/seller-dashboard/billing-and-payments");
          }}
        />
      )}
      <AlertDialog>
        <AlertDialogTrigger asChild className="cursor-pointer">
          <IconButton
            variant="destructive"
            Icon={Trash}
            title="Delete profile"
            type="button"
            isLoading={loading}
          />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are your absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you absolutely sure you want to delete your account? All
              information you have with us will be deletd and there is no
              recovery option.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button asChild onClick={handleDeleteAccount} variant="destructive">
              <AlertDialogAction>Continue</AlertDialogAction>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
