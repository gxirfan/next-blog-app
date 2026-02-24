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

  const [status, setStatus] = useState<{
    open: boolean;
    type: "loading" | "success" | "error";
    title: string;
    message: string;
  }>({
    open: false,
    type: "loading",
    title: "",
    message: "",
  });

  // Dinamik Rol Renkleri ve Stilleri
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

  const handleSaveUser = async (userId: string, updatedData: any) => {
    setIsEditModalOpen(false);
    setStatus({
      open: true,
      type: "loading",
      title: "Kernel Update",
      message: "Patching identity data across distributed network...",
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
          message: "Data synchronized.",
        });

        router.refresh();

        setTimeout(() => setStatus((prev) => ({ ...prev, open: false })), 1500);

        setStatus({
          open: true,
          type: "success",
          title: "Update Verified",
          message: "Node updated successfully. Global registry re-indexing...",
        });
      }
    } catch (err: any) {
      setStatus({
        open: true,
        type: "error",
        title: "Protocol Violation",
        message: err.response?.data?.message || "An error occurred.",
      });
    }
  };

  const handleRefresh = () => {
    router.refresh();
    setStatus({ ...status, open: false });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="relative max-w-md group">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-cyan-500 transition-colors"
          size={16}
        />
        <input
          type="text"
          placeholder="Search users..."
          className="w-full border border-neutral-800/60 rounded-2xl pl-12 pr-6 py-3 text-sm text-neutral-200 focus:border-cyan-500/40 focus:outline-none transition-all placeholder:text-neutral-700 font-medium"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="border border-neutral-900 rounded-[2.5rem] overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-0">
          <thead>
            <tr className="bg-neutral-900/30 text-neutral-600 text-[10px] uppercase tracking-[0.25em] font-black">
              <th className="px-10 py-6 border-b border-neutral-800/50">
                Entity Identity
              </th>
              <th className="px-10 py-6 border-b border-neutral-800/50 text-center">
                Authorization Level
              </th>
              <th className="px-10 py-6 border-b border-neutral-800/50 text-right">
                Operations
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-900/40">
            {filteredUsers.map((user) => {
              const roleStyle = getRoleStyle(user.role);
              {
                if (
                  (user.role === "admin" || user.role === "moderator") &&
                  authUserRole === "moderator"
                ) {
                  return null;
                }

                if (authUserRole === "user") {
                  return null;
                }
              }
              return (
                <tr
                  key={user.id}
                  className="hover:bg-white/[0.015] transition-all duration-300 group"
                >
                  {/* Entity Column */}
                  <td className="px-10 py-7">
                    <div className="flex items-center space-x-5">
                      <div
                        className={`h-12 w-12 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 font-bold group-hover:border-cyan-500/40 transition-all duration-500`}
                      >
                        {user.username[0].toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="text-[15px] font-bold text-neutral-200 group-hover:text-cyan-400 transition-colors tracking-tight truncate uppercase">
                          {user.username}
                        </div>
                        <div className="text-[11px] text-neutral-600 font-mono tracking-tighter truncate opacity-60 mt-0.5">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Auth Column */}
                  <td className="px-10 py-7 text-center">
                    <span
                      className={`inline-flex items-center px-4 py-1.5 rounded-xl text-[10px] font-black border uppercase tracking-widest leading-none ${roleStyle.border} ${roleStyle.bg} ${roleStyle.text}`}
                    >
                      <Shield
                        size={12}
                        className={`mr-2 ${roleStyle.icon} opacity-70`}
                      />
                      {user.role}
                    </span>
                  </td>

                  {/* Actions Column */}
                  <td className="px-10 py-7 text-right">
                    <div className="flex justify-end space-x-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                      <button
                        disabled={
                          user.role === "admin" ||
                          authUserRole === "user" ||
                          user.role === authUserRole
                        }
                        onClick={() => {
                          setSelectedUser(user);
                          setIsEditModalOpen(true);
                        }}
                        className={`p-3 bg-neutral-900 border border-neutral-800 rounded-xl transition-all ${user.role === "admin" || authUserRole === "user" || user.role === authUserRole ? "opacity-20 cursor-not-allowed" : "text-neutral-400 hover:text-cyan-400 hover:border-cyan-500/40 active:scale-90"}`}
                      >
                        <Edit3 size={16} />
                      </button>
                      {/* <button className="p-3 bg-neutral-900 border border-neutral-800 text-neutral-500 hover:text-red-500 hover:border-red-500/40 rounded-xl transition-all active:scale-90">
                        <Trash2 size={16} />
                      </button> */}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {authUser.user && selectedUser && (
        <UserEditModal
          key={selectedUser.id}
          authUser={authUser.user}
          user={selectedUser}
          isOpen={isEditModalOpen}
          onClose={() => setSelectedUser(null)}
          onSave={handleSaveUser}
        />
      )}

      <StatusModal
        isOpen={status.open}
        type={status.type}
        title={status.title}
        message={status.message}
        onClose={() => {
          setStatus((prev: any) => ({ ...prev, open: false }));
          handleRefresh();
        }}
      />
    </div>
  );
}
