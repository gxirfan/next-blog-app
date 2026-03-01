"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import api from "@/api/axios";
import { IUserResponse } from "@/app/types/user-response.dto";

interface AuthContextType {
  user: IUserResponse | null;
  isLoading: boolean;
  login: (userData: IUserResponse) => void;
  logout: () => Promise<void>;
  checkAuthStatus: (forceRefresh?: boolean) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: IUserResponse | null;
}) => {
  const [user, setUser] = useState<IUserResponse | null>(initialUser);
  const [isLoading, setIsLoading] = useState(!initialUser);

  const isChecking = useRef(false);

  const checkAuthStatus = useCallback(
    async (forceRefresh = false) => {
      if (isChecking.current) return;
      if (!forceRefresh && initialUser && user) return;

      if (!forceRefresh) {
        const hasCookie =
          typeof document !== "undefined" &&
          document.cookie.includes("connect.sid");

        if (!hasCookie) {
          setUser(null);
          setIsLoading(false);
          return;
        }
      }

      isChecking.current = true;
      try {
        const response = await api.get(`/auth/status?t=${Date.now()}`);

        const userData =
          response.data?.data?.user ||
          response.data?.user ||
          response.data?.data;

        if (userData) {
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        if (forceRefresh) setUser(null);
      } finally {
        setIsLoading(false);
        isChecking.current = false;
      }
    },
    [initialUser, user],
  );

  useEffect(() => {
    if (initialUser) {
      setIsLoading(false);
      return;
    }
    checkAuthStatus();
  }, [initialUser, checkAuthStatus]);

  const login = (userData: IUserResponse) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, logout, checkAuthStatus }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
