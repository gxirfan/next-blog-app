import { ListChecks, Bell, AlertCircle, Loader2 } from "lucide-react";
import { fetchAllNotifications } from "./fetcher";
import { Suspense } from "react";
import PaginationControls from "@/app/components/PaginationControls";
import NotificationListItem from "../_components/NotificationListItem";
import { INotification } from "@/app/types/notification";
import { redirect } from "next/navigation";

interface NotificationsPageProps {
  searchParams: {
    page?: string;
    limit?: string;
  };
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export default async function NotificationsPage({
  searchParams,
}: NotificationsPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || String(DEFAULT_PAGE));
  const limit = parseInt(params.limit || String(DEFAULT_LIMIT));

  const response = await fetchAllNotifications({ page, limit });

  if (!response.success && response.statusCode === 401) {
    redirect("/login");
  }

  const notifications: INotification[] = response.data.data;
  const meta = response.data.meta;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10 min-h-screen animate-in fade-in duration-700">
      {/* 1. Header: Modern & Minimal */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-neutral-900 pb-10">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[10px] tracking-[0.3em] text-cyan-500">
            <Bell size={14} />
            <span>Activity Stream</span>
          </div>
          <div className="flex items-center gap-4">
            <h1 className="text-4xl md:text-5xl text-white tracking-tighter">
              Notifications
            </h1>
            <div className="px-3 py-1 bg-neutral-900 border border-neutral-800 rounded-full text-[10px] text-neutral-500">
              {meta.total} Total
            </div>
          </div>
        </div>
      </div>

      {/* 2. Error State: Integrated Label */}
      {!response.success && meta.total === 0 ? (
        <div className="flex items-center gap-3 p-6 bg-red-500/5 border border-red-500/10 rounded-[2rem] text-red-500 text-xs tracking-widest">
          <AlertCircle size={18} />
          <span>Error Syncing: {response.message || "Connection lost."}</span>
        </div>
      ) : null}

      {/* 3. Notification List: Capsule Stream */}
      <div className="space-y-3">
        {notifications.length === 0 && response.success ? (
          <div className="flex flex-col items-center justify-center py-24 bg-neutral-950 border border-neutral-900 rounded-[3rem]">
            <Bell size={48} className="text-neutral-900 mb-4" />
            <p className="text-[10px] tracking-[0.3em] text-neutral-700">
              Your stream is empty
            </p>
          </div>
        ) : (
          notifications.map((notification) => (
            <NotificationListItem
              key={notification.id}
              notification={notification}
            />
          ))
        )}
      </div>

      {/* 4. Pagination: Centered Controls */}
      {meta?.totalPages && meta.totalPages > 1 && (
        <div className="pt-10 border-t border-neutral-900">
          <Suspense
            fallback={
              <div className="flex items-center justify-center gap-2 text-neutral-700">
                <Loader2 size={16} className="animate-spin" />
                <span className="text-[10px] tracking-widest">
                  Syncing Pages...
                </span>
              </div>
            }
          >
            <PaginationControls meta={meta} />
          </Suspense>
        </div>
      )}
    </div>
  );
}
