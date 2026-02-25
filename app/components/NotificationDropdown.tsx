"use client";

import { useState, useEffect, useRef, ElementType } from "react";
import Link from "next/link";
import useSWR from "swr";
import {
  Bell,
  Check,
  ArrowUp,
  ArrowDown,
  MessageCircle,
  Info,
  Activity,
} from "lucide-react";
import api from "@/api/axios";
import Image from "next/image";
import { INotification } from "@/app/types/notification";
import { IBaseResponse } from "../types/common";
import { getRelativeTime } from "../utils/date";
import { ENV } from "@/config/env.config";
import { IPaginationResponse } from "../types/pagination-response";

const fetcher = (url: string) => api.get(url).then((res) => res.data);

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    data: response,
    mutate,
    isValidating,
  } = useSWR<IBaseResponse<IPaginationResponse<INotification>>>(
    "/notifications?page=1&limit=10",
    fetcher,
    {
      refreshInterval: 5000,
      dedupingInterval: 4000,
      revalidateOnFocus: true,
    },
  );

  const notifications: INotification[] = response?.data?.data || [];
  const unreadCount = response?.data?.meta?.total || 0;

  const getNotificationIcon = (
    type: string,
  ): { Icon: ElementType; colorClass: string } => {
    switch (type) {
      case "vote_up":
        return {
          Icon: ArrowUp,
          colorClass: "text-green-500 bg-green-500/10 border-green-500/20",
        };
      case "vote_down":
        return {
          Icon: ArrowDown,
          colorClass: "text-red-500 bg-red-500/10 border-red-500/20",
        };
      case "reply":
        return {
          Icon: MessageCircle,
          colorClass: "text-cyan-500 bg-cyan-500/10 border-cyan-500/20",
        };
      default:
        return {
          Icon: Info,
          colorClass:
            "text-neutral-500 bg-neutral-500/10 border-neutral-500/20",
        };
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      )
        setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = async (notification: INotification) => {
    if (!notification.isRead) {
      try {
        await api.patch(`/notifications/${notification.id}/read`);
        mutate();
      } catch (e) {
        console.error(e);
      }
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative p-2 rounded-full cursor-pointer hover:bg-neutral-900 border border-transparent hover:border-neutral-800 transition-all duration-200"
      >
        <Bell
          size={20}
          className={
            unreadCount > 0
              ? "text-cyan-400"
              : "text-neutral-500 group-hover:text-white"
          }
        />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-3 h-3 bg-cyan-500 rounded-full border-2 border-black animate-pulse" />
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full right-[-50px] sm:right-0 mt-4 z-[100] w-[calc(100vw-32px)] sm:w-[380px] bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="px-5 py-4 flex justify-between items-center border-b border-neutral-900 bg-neutral-900/20">
            <div className="flex items-center gap-2">
              <Activity
                size={14}
                className={
                  isValidating
                    ? "text-cyan-500 animate-pulse"
                    : "text-neutral-600"
                }
              />
              <h3 className="text-[11px] font-bold tracking-[0.15em] text-neutral-400">
                Signals
              </h3>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-md bg-cyan-500/10 text-cyan-500 text-[10px] font-bold border border-cyan-500/20">
                  {unreadCount}
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={() =>
                  api.patch("/notifications/read-all").then(() => mutate())
                }
                className="text-[10px] font-bold text-neutral-500 hover:text-white flex items-center gap-1 transition-colors"
              >
                <Check size={12} /> Mark All Read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-[400px] overflow-y-auto custom-scrollbar divide-y divide-neutral-900">
            {notifications.length === 0 ? (
              <div className="py-16 text-center flex flex-col items-center gap-3">
                <div className="p-3 rounded-xl bg-neutral-900/50 border border-neutral-800">
                  <Bell size={20} className="text-neutral-700" />
                </div>
                <p className="text-neutral-600 text-[10px] font-bold tracking-widest">
                  Frequency Clear
                </p>
              </div>
            ) : (
              notifications.map((notification) => {
                const { Icon: NotifIcon, colorClass } = getNotificationIcon(
                  notification.type,
                );
                const avatarUrl = notification.senderAvatar
                  ? ENV.API_IMAGE_URL + notification.senderAvatar
                  : "/images/default-avatar.png";

                return (
                  <Link
                    key={notification.id}
                    href={notification.targetUrl || "/"}
                    onClick={() => handleNotificationClick(notification)}
                    className={`flex items-start gap-4 p-4 transition-colors hover:bg-neutral-900/50 group relative ${!notification.isRead ? "bg-cyan-500/3" : ""}`}
                  >
                    <div className="shrink-0 relative">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden border border-neutral-800 bg-neutral-900">
                        <Image
                          src={avatarUrl}
                          width={40}
                          height={40}
                          className="object-cover transition-transform group-hover:scale-110 duration-500"
                          alt="User"
                        />
                      </div>
                      <div
                        className={`absolute -bottom-1 -right-1 p-1 rounded-md border border-neutral-950 ${colorClass}`}
                      >
                        <NotifIcon size={10} strokeWidth={3} />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-[12px] leading-[1.6] ${!notification.isRead ? "text-neutral-200 font-medium" : "text-neutral-500"}`}
                      >
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[9px] font-mono text-neutral-700 tracking-tighter">
                          {getRelativeTime(notification.createdAt)}
                        </span>
                        {!notification.isRead && (
                          <div className="w-1 h-1 bg-cyan-500 rounded-full animate-pulse" />
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>

          {/* Footer */}
          <Link
            href="/notification/all"
            className="block p-4 bg-neutral-900/30 hover:bg-neutral-900 text-center border-t border-neutral-900 transition-colors group"
          >
            <span className="text-[12px] font-bold tracking-[0.2em] text-neutral-600 group-hover:text-cyan-500 transition-colors">
              Access Full List
            </span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
