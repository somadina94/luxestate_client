"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useCallback,
} from "react";
import notificationService from "@/services/notifications/notification-service";
import { subscribeToPush } from "@/utils/subscribe-to-push-notification";

type NotificationContextType = {
  notifyUnreadChanged: () => void;
  requestPermissionAndSubscribe: () => Promise<boolean>;
};

const NotificationContext = createContext<NotificationContextType>({
  notifyUnreadChanged: () => {},
  requestPermissionAndSubscribe: async () => false,
});

const VAPID_KEY =
  (typeof process !== "undefined" &&
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY?.trim()) ||
  "";

export function NotificationProvider({
  accessToken,
  children,
}: {
  accessToken: string | null;
  children: React.ReactNode;
}) {
  const subscribedRef = useRef(false);

  const subscribeWebPush = useCallback(async (): Promise<boolean> => {
    if (!accessToken || !VAPID_KEY) return false;
    if (subscribedRef.current) return true;
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return false;
    try {
      const reg = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      });
      await reg.update();
      const payload = await subscribeToPush(VAPID_KEY);
      if (!payload) return false;
      const res = await notificationService.subscribeWebPush(
        payload,
        accessToken,
      );
      if (res.status === 201) {
        subscribedRef.current = true;
        return true;
      }
      return false;
    } catch {
      // subscription failed
      return false;
    }
  }, [accessToken]);

  const requestPermissionAndSubscribe = useCallback(async (): Promise<boolean> => {
    if (!accessToken || !VAPID_KEY) return false;
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return false;
    if (Notification.permission === "granted") {
      return subscribeWebPush();
    }
    if (Notification.permission === "denied") return false;

    try {
      // Request permission FIRST so the prompt runs in the user-gesture context.
      const permission = await Notification.requestPermission();
      if (permission !== "granted") return false;

      const reg = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      });
      await reg.update();
      const payload = await subscribeToPush(VAPID_KEY, {
        skipPermission: true,
      });
      if (!payload) return false;
      const res = await notificationService.subscribeWebPush(
        payload,
        accessToken,
      );
      if (res.status === 201) {
        subscribedRef.current = true;
        return true;
      }
      return false;
    } catch {
      // subscription failed
      return false;
    }
  }, [accessToken, subscribeWebPush]);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "Notification" in window &&
      Notification.permission === "granted"
    ) {
      void subscribeWebPush();
    }
  }, [subscribeWebPush]);

  const notifyUnreadChanged = useCallback(() => {
    window.dispatchEvent(new CustomEvent("notification:unread-changed"));
  }, []);

  return (
    <NotificationContext.Provider
      value={{ notifyUnreadChanged, requestPermissionAndSubscribe }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  return useContext(NotificationContext);
}
