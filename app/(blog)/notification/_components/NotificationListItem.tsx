import React, { ElementType } from "react";
import Link from "next/link";
import Image from "next/image";
import { INotification } from "@/app/types/notification";
import {
  ArrowBigUp,
  ArrowBigDown,
  MessageSquare,
  ListChecks,
} from "lucide-react";
import { getRelativeTime } from "@/app/utils/date";

interface NotificationListItemProps {
  notification: INotification;
}

const getNotificationIcon = (
  type: string,
): { Icon: ElementType; color: string } => {
  switch (type) {
    case "vote_up":
      return { Icon: ArrowBigUp, color: "bg-green-600" };
    case "vote_down":
      return { Icon: ArrowBigDown, color: "bg-red-600" };
    case "reply":
      return { Icon: MessageSquare, color: "bg-blue-600" };
    default:
      return { Icon: ListChecks, color: "bg-neutral-600" };
  }
};

const NotificationListItem: React.FC<NotificationListItemProps> = ({
  notification,
}) => {
  const { Icon, color } = getNotificationIcon(notification.type);

  const avatarUrl = notification.senderAvatar
    ? process.env.NEXT_PUBLIC_API_IMAGE_URL + notification.senderAvatar
    : "http://localhost:3000/images/user/avatars/default-avatar.png";

  return (
    <Link
      href={notification.targetUrl}
      className={`flex items-start p-4 rounded-lg transition-colors border border-neutral-700
                ${
                  !notification.isRead
                    ? "bg-neutral-900 border-cyan-800 hover:bg-neutral-800"
                    : "bg-neutral-900 hover:bg-neutral-900"
                }`}
    >
      <div className="shrink-0 mr-4 relative">
        <div className="w-10 h-10 relative rounded-full overflow-hidden bg-neutral-800">
          <Image
            src={avatarUrl}
            fill
            className="object-cover"
            alt={`${notification.senderUsername}'s avatar`}
          />
        </div>

        <div
          className={`absolute top-0 right-0 p-1 rounded-full border-2 border-neutral-900 text-white ${color}`}
        >
          <Icon size={12} />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <p
          className={`text-sm ${
            !notification.isRead ? "text-white font-medium" : "text-neutral-300"
          }`}
        >
          {notification.message}
        </p>
        <span className="text-xs text-neutral-500 mt-1 flex items-center space-x-2">
          {!notification.isRead && (
            <span className="w-2 h-2 bg-cyan-400 rounded-full mr-1 shrink-0"></span>
          )}
          <span>{getRelativeTime(notification.createdAt)}</span>
        </span>
      </div>
    </Link>
  );
};

export default NotificationListItem;
