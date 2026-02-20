import { cookies } from "next/headers";
import { INotification } from "@/app/types/notification";
import { IBaseResponse } from "@/app/types/common";
import { ENV } from "@/config/env.config";

interface NotificationListParams {
  page: number;
  limit: number;
}

interface IPaginationResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export async function fetchAllNotifications({
  page,
  limit,
}: NotificationListParams): Promise<
  IBaseResponse<IPaginationResponse<INotification>>
> {
  const headersList = await cookies();
  const cookieHeader = headersList.toString();

  if (!cookieHeader) {
    return {
      data: { data: [], meta: { total: 0, page, limit, totalPages: 0 } },
      success: false,
      message: "No cookie found",
      statusCode: 401,
    };
  }

  try {
    const url = `${ENV.API_URL}/notifications/all?page=${page}&limit=${limit}`;

    const response = await fetch(url, {
      headers: {
        Cookie: cookieHeader,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(`Failed to fetch notifications: ${response.status}`);
      return {
        data: { data: [], meta: { total: 0, page, limit, totalPages: 0 } },
        success: false,
        message: "Failed to fetch notifications",
        statusCode: response.status,
      };
    }

    const result = await response.json();

    return result as IBaseResponse<IPaginationResponse<INotification>>;
  } catch (error) {
    console.error("Notifications list fetch error:", error);
    return {
      data: { data: [], meta: { total: 0, page, limit, totalPages: 0 } },
      success: false,
      message: "Failed to fetch notifications",
      statusCode: 500,
    };
  }
}
