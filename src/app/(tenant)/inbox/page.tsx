"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import NotificationPills from "@/components/NotificationPills";
import NotificationList from "@/components/NotificationList";
import { Doc } from "../../../../convex/_generated/dataModel";

export default function Inbox() {
  const [activeCategory, setActiveCategory] = useState("All");
  const user = useQuery(api.user.currentUser)!;
  const notifications = useQuery(api.notifications.getNotifications, {
    userId: user?._id,
  });
  const markAsRead = useMutation(api.notifications.markAsRead);

  // Filter notifications by category
  const filteredNotifications = notifications?.filter(
    (notification: Doc<"notifications">) => {
      if (activeCategory === "All") return true;
      return notification.type.toLowerCase() === activeCategory.toLowerCase();
    }
  );

  // Group notifications by time period
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;
  const sevenDays = 7 * oneDay;
  const thirtyDays = 30 * oneDay;

  const newNotifications = filteredNotifications?.filter(
    (notification: Doc<"notifications">) => !notification.read
  );
  const lastSevenDays = filteredNotifications?.filter(
    (notification: Doc<"notifications">) =>
      notification.read && now - notification.createdAt <= sevenDays
  );
  const lastThirtyDays = filteredNotifications?.filter(
    (notification: Doc<"notifications">) =>
      notification.read &&
      now - notification.createdAt > sevenDays &&
      now - notification.createdAt <= thirtyDays
  );

  const handleNotificationClick = async (
    notification: Doc<"notifications">
  ) => {
    if (!notification.read) {
      await markAsRead({ notificationId: notification._id });
    }
    // Handle navigation based on notification type and relatedId
    // This would depend on your app's routing structure
  };

  return (
    <div className="px-5 pt-10">
      <h1 className="text-2xl font-semibold mb-6">Inbox</h1>
      <NotificationPills
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      <div className="space-y-8">
        <NotificationList
          title="New"
          notifications={newNotifications || []}
          onNotificationClick={handleNotificationClick}
        />
        <NotificationList
          title="Last 7 days"
          notifications={lastSevenDays || []}
          onNotificationClick={handleNotificationClick}
        />
        <NotificationList
          title="Last 30 days"
          notifications={lastThirtyDays || []}
          onNotificationClick={handleNotificationClick}
        />
      </div>
    </div>
  );
}
