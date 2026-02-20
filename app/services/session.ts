import { ENV } from "@/config/env.config";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

async function getCurrentUser() {
  try {
    const headerList = await cookies();
    const cookieString = headerList.toString();

    if (!cookieString) return null;

    const res = await fetch(`${ENV.API_URL}/auth/status`, {
      cache: "no-store",
      headers: {
        Cookie: cookieString,
        Accept: "application/json",
      },
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
}

export async function getRequiredAuthSession(returnUrl: string) {
  const session = await getCurrentUser();

  if (!session) {
    redirect(`/login?returnUrl=${returnUrl}`);
  }

  return session;
}
