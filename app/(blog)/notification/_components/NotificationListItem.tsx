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
import { ENV } from "@/config/env.config";
import { ElementType } from "react";

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
    case "flow_reply":
      return { Icon: MessageSquare, color: "bg-blue-600" };
    case "post_reply":
      return { Icon: MessageSquare, color: "bg-blue-600" };
    default:
      return { Icon: ListChecks, color: "bg-neutral-600" };
  }
};

const NotificationListItem = ({ notification }: NotificationListItemProps) => {
  const { Icon, color } = getNotificationIcon(notification.type);

  const avatarUrl = notification.senderAvatar
    ? ENV.API_IMAGE_URL + notification.senderAvatar
    : ENV.API_IMAGE_URL + "/images/user/avatars/default-avatar.png";

  return (
    <Link
      href={
        notification.type.toLowerCase() === "flow_reply"
          ? "/stream/thread/" + notification.targetUrl
          : notification.type.toLowerCase() === "post_reply"
            ? "/post/" + notification.targetUrl
            : notification.type.toLowerCase() === "vote_up" ||
                notification.type.toLowerCase() === "vote_down"
              ? "/post/" + notification.targetUrl
              : notification.targetUrl
      }
      className={`flex items-start gap-5 p-5 transition-all duration-100 border-b border-neutral-900 group relative
              ${
                !notification.isRead
                  ? "bg-cyan-500/3 hover:bg-cyan-500/6"
                  : "bg-transparent hover:bg-white/2"
              }`}
    >
      {!notification.isRead && (
        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-cyan-500" />
      )}

      <div className="shrink-0 relative">
        <div className="w-14 h-14 rounded-full overflow-hidden relative">
          <Image
            src={avatarUrl}
            fill
            className="object-cover"
            alt={`${notification.senderNickname}'s avatar`}
          />
        </div>
        <div
          className={`absolute -bottom-1 -right-1 p-2 rounded-full border-2 border-neutral-950 ${color}`}
        >
          <Icon size={12} strokeWidth={3} />
        </div>
      </div>

      <div className="flex-1 min-w-0 pt-1">
        <div className="flex justify-between items-start gap-4">
          <p
            className={`text-[15px] leading-relaxed break-words ${
              !notification.isRead
                ? "text-neutral-100 font-semibold"
                : "text-neutral-400"
            }`}
          >
            {notification.message}
          </p>

          {!notification.isRead && (
            <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2 shrink-0 animate-pulse" />
          )}
        </div>

        <div className="flex items-center gap-3 mt-3">
          <span className="text-[10px] font-black tracking-[0.15em] text-neutral-600">
            {getRelativeTime(notification.createdAt)}
          </span>
          <div className="h-px w-4 bg-neutral-800" />
          <span className="text-[9px] font-bold text-neutral-700 tracking-widest">
            Signal Received
          </span>
        </div>
      </div>
    </Link>
  );
};

export default NotificationListItem;
