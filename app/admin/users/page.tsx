import UserTable from "./_components/UserTable";
import UserHeader from "./_components/UserHeader";
import UserFooter from "./_components/UserFooter";
import { IUserResponse } from "@/app/types/user-response.dto";
import { ENV } from "@/config/env.config";
import { cookies } from "next/headers";

async function getUsers(): Promise<IUserResponse[]> {
  const headerList = await cookies();
  try {
    const res = await fetch(`${ENV.API_URL}/admin/get-users`, {
      method: "GET",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Cookie: headerList.toString(),
        Accept: "application/json",
        "X-Admin-Panel": "true",
      },
    });

    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("User fetch error:", error);
    return [];
  }
}

export default async function UserManagementPage() {
  const users = await getUsers();

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <UserHeader count={users.length} />

      <div className="min-h-[400px]">
        {users.length === 0 ? (
          <div className="py-32 text-center border border-neutral-900 rounded-[2.5rem]">
            <p className="text-neutral-600 text-sm font-mono uppercase tracking-widest">
              Null_Identity_Detected
            </p>
          </div>
        ) : (
          <UserTable initialUsers={users} />
        )}
      </div>

      <UserFooter />
    </div>
  );
}
