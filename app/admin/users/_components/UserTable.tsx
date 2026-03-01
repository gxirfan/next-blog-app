"use client";

import { useState } from "react";
import { Search, Edit3, Shield } from "lucide-react";
import { IUserResponse } from "@/app/types/user-response.dto";
import UserEditModal from "./UserEditModal";
import StatusModal from "./StatusModal";
import api from "@/api/axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

export default function UserTable({
  initialUsers,
}: {
  initialUsers: IUserResponse[];
}) {
  const router = useRouter();
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<IUserResponse | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const authUser = useAuth();
  const authUserRole = authUser.user?.role;

  const [status, setStatus] = useState<any>({
    open: false,
    type: "loading",
    title: "",
    message: "",
  });

  const getRoleStyle = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return {
          text: "text-red-400",
          border: "border-red-500/20",
          bg: "bg-red-500/5",
          icon: "text-red-500",
        };
      case "moderator":
        return {
          text: "text-yellow-400",
          border: "border-yellow-500/20",
          bg: "bg-yellow-500/5",
          icon: "text-yellow-500",
        };
      case "writer":
        return {
          text: "text-green-400",
          border: "border-green-500/20",
          bg: "bg-green-500/5",
          icon: "text-green-500",
        };
      default:
        return {
          text: "text-neutral-500",
          border: "border-neutral-800",
          bg: "bg-neutral-900/40",
          icon: "text-neutral-600",
        };
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSaveUser = async (userId: number, updatedData: any) => {
    setIsEditModalOpen(false);
    setStatus({
      open: true,
      type: "loading",
      title: "Updating Data",
      message: "Synchronizing identity parameters...",
    });

    try {
      const response = await api.patch(
        `/admin/update-user/${userId}`,
        updatedData,
      );
      if (response.status === 200 || response.status === 201) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, ...updatedData } : u)),
        );
        setStatus({
          open: true,
          type: "success",
          title: "Update Verified",
          message: "Identity registry updated successfully.",
        });
        router.refresh();
        setTimeout(() => setStatus((p: any) => ({ ...p, open: false })), 1500);
      }
    } catch (err: any) {
      setStatus({
        open: true,
        type: "error",
        title: "Update Failed",
        message: err.response?.data?.message || "Protocol error.",
      });
    }
  };

  return (
    <div className="space-y-10">
      <div className="relative max-w-md group px-2">
        <Search
          className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-800 group-focus-within:text-white transition-colors"
          size={18}
        />
        <input
          type="text"
          placeholder="SEARCH IDENTITY..."
          className="w-full bg-neutral-950 border-2 border-neutral-900 rounded-2xl pl-14 pr-6 py-4 text-[11px] font-black tracking-widest text-white focus:border-neutral-700 transition-all placeholder:text-neutral-800"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="border-2 border-neutral-900 rounded-[3rem] overflow-hidden bg-neutral-950 overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-0">
          <thead>
            <tr className="bg-neutral-950 text-neutral-700 text-[10px] font-black tracking-[0.3em]">
              <th className="px-10 py-7 border-b-2 border-neutral-900">
                Identity Details
              </th>
              <th className="px-10 py-7 border-b-2 border-neutral-900 text-center">
                Clearance
              </th>
              <th className="px-10 py-7 border-b-2 border-neutral-900 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-neutral-900">
            {filteredUsers.map((user) => {
              if (
                (user.role.toLowerCase() === "admin" ||
                  user.role.toLowerCase() === "moderator") &&
                authUserRole === "moderator"
              )
                return null;
              if (authUserRole === "user") return null;
              const style = getRoleStyle(user.role);

              return (
                <tr
                  key={user.id}
                  className="hover:bg-neutral-900/40 transition-all duration-300 group"
                >
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-6">
                      <div className="h-14 w-14 rounded-2xl bg-neutral-900 border-2 border-neutral-800 flex items-center justify-center text-white font-black text-xl group-hover:border-white transition-all">
                        {user.username[0].toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="text-lg font-black text-white tracking-tighter leading-none group-hover:pl-1 transition-all">
                          {user.username}
                        </div>
                        <div className="text-[10px] text-neutral-600 font-bold tracking-wider mt-2">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-center">
                    <span
                      className={`inline-flex items-center px-5 py-2 rounded-xl text-[10px] font-black border-2 tracking-widest ${style.border} ${style.bg} ${style.text}`}
                    >
                      <Shield size={12} className="mr-2 opacity-70" />
                      {user.role}
                    </span>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <button
                      disabled={
                        user.role.toLowerCase() === "admin" ||
                        user.role.toLowerCase() === authUserRole
                      }
                      onClick={() => {
                        setSelectedUser(user);
                        setIsEditModalOpen(true);
                      }}
                      className="p-4 bg-neutral-900 border-2 border-neutral-800 text-neutral-500 hover:text-white hover:border-white rounded-2xl transition-all active:scale-90 disabled:opacity-10"
                    >
                      <Edit3 size={18} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {authUser.user && selectedUser && (
        <UserEditModal
          user={selectedUser}
          authUser={authUser.user}
          isOpen={isEditModalOpen}
          onClose={() => setSelectedUser(null)}
          onSave={handleSaveUser}
        />
      )}

      <StatusModal
        {...status}
        onClose={() => setStatus({ ...status, open: false })}
      />
    </div>
  );
}
