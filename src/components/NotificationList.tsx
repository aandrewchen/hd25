import { Doc } from "../../convex/_generated/dataModel";
import { formatDistanceToNow } from "date-fns";

interface NotificationListProps {
  title: string;
  notifications: Doc<"notifications">[];
  onNotificationClick: (notification: Doc<"notifications">) => void;
}

export default function NotificationList({
  title,
  notifications,
  onNotificationClick,
}: NotificationListProps) {
  if (notifications.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification._id}
            onClick={() => onNotificationClick(notification)}
            className={`p-4 rounded-lg cursor-pointer ${
              notification.read ? "bg-white" : "bg-blue-50"
            } border border-gray-200 hover:border-blue-300 transition-colors`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{notification.title}</h3>
                <p className="text-gray-600 text-sm mt-1">
                  {notification.message}
                </p>
              </div>
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(notification.createdAt, {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
