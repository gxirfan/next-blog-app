"use client";

import { useState, useEffect, useRef, ElementType } from "react";
import Link from "next/link";
import {
  Bell,
  Check,
  ArrowUp,
  ArrowDown,
  MessageCircle,
  Info,
  ChevronRight,
} from "lucide-react";
import api from "@/api/axios";
import Image from "next/image";
import { INotification } from "@/app/types/notification";
import { IBaseResponse } from "../types/common";
import { getRelativeTime } from "../utils/date";
import { ENV } from "@/config/env.config";

interface IPaginationResponse<T> {
  data: T[];
  meta: {
    total: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
}

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.get("/notifications?page=1&limit=10");
      const paginatedResponse = res.data as IBaseResponse<
        IPaginationResponse<INotification>
      >;
      const fetchedData = paginatedResponse.data.data;

      setNotifications(
        fetchedData && Array.isArray(fetchedData) ? fetchedData : [],
      );
      setUnreadCount(paginatedResponse.data.meta.total || 0);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  };

  const getNotificationIcon = (
    type: string,
  ): { Icon: ElementType; colorClass: string } => {
    switch (type) {
      case "vote_up":
        return { Icon: ArrowUp, colorClass: "text-green-400 bg-green-400/10" };
      case "vote_down":
        return { Icon: ArrowDown, colorClass: "text-red-400 bg-red-400/10" };
      case "reply":
        return {
          Icon: MessageCircle,
          colorClass: "text-cyan-400 bg-cyan-400/10",
        };
      default:
        return { Icon: Info, colorClass: "text-neutral-400 bg-neutral-400/10" };
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = async (notification: INotification) => {
    setIsOpen(false);
    if (!notification.isRead) {
      try {
        await api.patch(`/notifications/${notification.id}/read`);
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notification.id ? { ...n, isRead: true } : n,
          ),
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (e) {
        console.error(e);
      }
    }
  };

  const markAllRead = async () => {
    try {
      await api.patch("/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* BELL TRIGGER */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative p-2.5 rounded-full hover:bg-neutral-900 transition-all duration-300 cursor-pointer"
      >
        <Bell
          size={22}
          className={
            unreadCount > 0
              ? "text-white"
              : "text-neutral-500 group-hover:text-white transition-colors"
          }
        />
        {unreadCount > 0 && (
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
        )}
      </button>

      {/* DROPDOWN MENU */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-[340px] sm:w-[380px] bg-neutral-950/95 backdrop-blur-xl border border-neutral-800 rounded-4xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
          {/* Header */}
          <div className="p-6 pb-4 flex justify-between items-center border-b border-neutral-900">
            <h3 className="text-[10px] uppercase tracking-[0.3em] text-white">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 hover:text-cyan-400 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Check size={12} /> Mark all
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-[420px] overflow-y-auto scrollbar-hide">
            {loading && notifications.length === 0 ? (
              <div className="p-10 text-center text-neutral-600 text-[10px] font-bold uppercase tracking-widest animate-pulse">
                Fetching signals...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center gap-3">
                <Bell size={28} className="text-neutral-800" />
                <p className="text-neutral-600 text-[10px] font-bold uppercase tracking-[0.2em]">
                  Clear stream
                </p>
              </div>
            ) : (
              notifications.map((notification) => {
                const { Icon: NotifIcon, colorClass } = getNotificationIcon(
                  notification.type,
                );
                const avatarUrl = notification.senderAvatar
                  ? ENV.API_IMAGE_URL + notification.senderAvatar
                  : ENV.API_IMAGE_URL +
                    "/images/user/avatars/default-avatar.png";

                return (
                  <Link
                    key={notification.id}
                    href={notification.targetUrl}
                    onClick={() => handleNotificationClick(notification)}
                    className={`flex items-center gap-4 p-4 transition-all duration-300 border-b border-neutral-900/50 hover:bg-neutral-900/40 relative group
                                ${!notification.isRead ? "bg-cyan-500/3" : ""}`}
                  >
                    {/* Avatar & Icon Badge */}
                    <div className="shrink-0 relative">
                      <div className="w-11 h-11 rounded-full overflow-hidden border border-neutral-800 bg-neutral-900 relative">
                        <Image
                          src={avatarUrl}
                          fill
                          className="object-cover transition-transform group-hover:scale-110 duration-500"
                          alt="Sender"
                        />
                      </div>
                      <div
                        className={`absolute -bottom-1 -right-1 p-1 rounded-full border-2 border-neutral-950 ${colorClass}`}
                      >
                        <NotifIcon size={10} strokeWidth={3} />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-[13px] leading-snug wrap-break-word ${
                          !notification.isRead
                            ? "text-neutral-100 font-bold"
                            : "text-neutral-400"
                        }`}
                      >
                        {notification.message}
                      </p>
                      <span className="text-[10px] font-medium text-neutral-600 mt-1.5 block uppercase">
                        {getRelativeTime(notification.createdAt) || "Unknown"}
                      </span>
                    </div>

                    {/* Status Dot */}
                    {!notification.isRead && (
                      <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full shrink-0" />
                    )}
                  </Link>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-2 bg-neutral-900/20 border-t border-neutral-900">
            <Link
              href="/notification/all"
              className="group flex items-center justify-center gap-2 py-3 rounded-2xl hover:bg-neutral-900 transition-all"
            >
              <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 group-hover:text-cyan-400 transition-colors">
                View All Activity
              </span>
              <ChevronRight
                size={14}
                className="text-neutral-600 group-hover:text-cyan-400 transition-colors"
              />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
