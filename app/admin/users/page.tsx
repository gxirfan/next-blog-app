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
    return [];
  }
}

export default async function UserManagementPage() {
  const users = await getUsers();

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 px-4 md:px-0">
      <UserHeader count={users.length} />
      <div className="min-h-[400px]">
        {users.length === 0 ? (
          <div className="py-40 text-center border-2 border-neutral-900 rounded-[3rem] bg-neutral-950/50">
            <p className="text-neutral-700 text-[10px] font-black tracking-[0.5em]">
              No Identity Nodes Detected
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
