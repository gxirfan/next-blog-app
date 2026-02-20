// lib/auth-server.ts
import { cookies } from "next/headers";
import { ENV } from "@/config/env.config";
import { IUserResponse } from "@/app/types/user-response.dto";

export async function getSSRUser(): Promise<IUserResponse | null> {
  const cookieStore = await cookies();
  const cookieString = cookieStore.toString();

  if (!cookieString) return null;

  try {
    const res = await fetch(`${ENV.API_URL}/auth/status`, {
      cache: "no-store",
      headers: {
        Cookie: cookieString,
      },
    });

    if (!res.ok) return null;
    const responseData = await res.json();
    return responseData.data?.user || null;
  } catch (error) {
    console.error("SSR Auth Error:", error);
    return null;
  }
}
